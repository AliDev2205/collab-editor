# Architecture technique — CollabEditor

## Vue d'ensemble

L'application suit une architecture **composants + stores + simulation** où chaque couche a une responsabilité unique.

```
┌─────────────────────────────────────────────┐
│                  App.tsx                     │
│         (Layout + Responsive drawers)       │
├──────┬────────────┬──────────┬──────────────┤
│Header│LeftSidebar │EditorPanel│ RightPanel  │
│      │            │           │             │
│      │            │           │ ActivityLog │
│      │            │           │ ChatModule  │
├──────┴────────────┴───────────┴─────────────┤
│              DebugConsole (Footer)           │
└─────────────────────────────────────────────┘
         ↕                    ↕
    Zustand Stores       SimulationEngine
    (6 slices)           (3 modules)
```

## Gestion d'état — Zustand

### Pourquoi Zustand plutôt que Redux ou Context ?

1. **Pas de Provider** — accès au store depuis n'importe où, y compris hors React (`getState()` dans `SimulationEngine`)
2. **Sélecteurs automatiques** — `useStore((s) => s.field)` évite les re-renders inutiles
3. **Simplicité** — pas de boilerplate action/reducer/dispatch
4. **Immer intégré** — mutations lisibles avec immutabilité garantie

### Stores et leurs responsabilités

| Store | Données | Accédé par |
|---|---|---|
| `documentSlice` | Contenu, titre, historique undo/redo | EditorPanel, Header, Simulation |
| `usersSlice` | 3 utilisateurs, typing, curseur, ops | Sidebar, CursorLayer, Simulation |
| `syncSlice` | Statut connexion, latence | Header, Editor, Footer, Simulation |
| `logsSlice` | Journal d'activité (max 200) | RightPanel, Simulation |
| `chatSlice` | Messages chat (max 100) | RightPanel, Simulation |
| `uiSlice` | État drawers mobile | App |

### Pourquoi des stores séparés ?

Un store unique causerait des re-renders en cascade : chaque opération simulée modifie `content`, `users`, `sync`, et `logs` simultanément. Avec des stores séparés, seuls les composants abonnés au store modifié se mettent à jour.

## Simulation — Pas de vrai OT/CRDT

### Choix délibéré

L'Operational Transformation (OT) ou les CRDT (Conflict-free Replicated Data Types) sont des algorithmes complexes conçus pour résoudre les conflits d'édition concurrente dans un vrai environnement distribué.

Dans le cadre de ce test, la simulation est **single-process** : toutes les opérations passent par le même état JavaScript. Il n'y a donc **pas de vrai conflit** à résoudre. Implémenter un OT complet aurait :

- Ajouté une complexité disproportionnée
- N'aurait pas été observable dans l'UI
- Serait sorti du périmètre du test (focus sur l'architecture React et les performances UI)

### Ce qui est simulé

- **Latence réseau** : `NetworkSimulator` impose un délai aléatoire (100–1500 ms) via `setTimeout`
- **Perte de paquets** : 1 % de chance qu'une opération soit « perdue » (loguée mais non appliquée)
- **Typing indicators** : chaque user affiche un état « en train d'écrire » pendant 800 ms
- **Opérations Insert/Delete** : `OperationGenerator` crée des opérations réalistes (phrases, suppressions de fin de ligne)

### Undo/Redo et opérations distantes

L'historique undo ne concerne que les actions de l'utilisateur local (via `setContent`). Les opérations simulées utilisent `setContentSilent` qui modifie le contenu sans toucher à l'historique. C'est un compromis pragmatique — dans un vrai système, l'undo nécessiterait un inverse-OT ou un historique par utilisateur.

## Performance

### Stratégies utilisées

1. **`React.memo()`** sur tous les composants
2. **Sélecteurs fins Zustand** — `useStore((s) => s.specificField)` au lieu de `useStore()`
3. **`LineNumbers` avec comparateur custom** — ne re-rend que si le nombre de lignes change
4. **`DebugConsole` en polling** — `setInterval(500ms)` + `getState()` direct au lieu de subscriptions réactives
5. **Curseurs en `pointer-events-none`** — positionnement absolu sans impact sur le layout
6. **Stores séparés** — isolation des domaines pour éviter les cascades

## Responsive

Le responsive est géré par deux mécanismes complémentaires :

1. **Desktop** : Tailwind breakpoints `md:flex` / `lg:flex` pour afficher les panneaux latéraux
2. **Mobile** : Drawers coulissants (`transform translate-x`) pilotés par `uiSlice`, avec backdrop et boutons flottants

Ce design évite de dupliquer le code des panneaux — les mêmes composants `LeftSidebar` et `RightPanel` sont réutilisés dans les deux contextes.
