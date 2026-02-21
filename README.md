# CollabEditor — Éditeur de texte collaboratif temps réel

> Test technique NiyiExpertise — Frontend Senior React
> Réalisé en 72h

![CollabEditor](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-4-orange)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

---

## Présentation

CollabEditor est une interface d'éditeur de texte collaboratif temps réel simulant des interactions multi-utilisateurs. L'application gère des flux de données asynchrones, des états de synchronisation complexes et une interface structurée en plusieurs panneaux.

### Fonctionnalités principales

- **3 utilisateurs simultanés** (Alice, Bob, Carol) avec avatars colorés
- **Simulation réseau réaliste** : latence aléatoire 100ms–1500ms, perte de paquets 1%
- **Curseurs multiples** positionnés en temps réel dans l'éditeur
- **Journal d'activité** chronologique des opérations
- **Module de chat** simulé avec messages automatiques
- **Undo/Redo** (Ctrl+Z / Ctrl+Shift+Z)
- **Dark Mode** natif
- **Responsive** (mobile, tablette, desktop)
- **Console de débogage** avec statistiques système

---

## Stack technique

| Technologie | Rôle |
|---|---|
| **Vite 5** | Bundler, dev server HMR |
| **React 18** | UI, hooks, memo |
| **TypeScript** | Typage strict end-to-end |
| **Tailwind CSS 3** | Styling, dark mode via classe |
| **Zustand 4** | State management par slices |
| **Immer** | Mutations immuables dans les slices |
| **clsx** | Composition de classes conditionnelles |
| **uuid** | Identifiants stables pour ops/messages |

---

## Installation

### Prérequis

- Node.js v18+
- npm v9+

### Setup

```bash
# Cloner le dépôt
git clone https://github.com/AliDev2205/collab-editor.git
cd collab-editor

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrir **http://localhost:5173** en navigation privée (recommandé pour éviter les conflits avec les extensions de navigateur type Grammarly).

### Build production

```bash
npm run build
npm run preview
```

---

## Architecture du projet

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx              — Barre supérieure globale
│   │   ├── DocumentTitle.tsx       — Titre éditable inline
│   │   ├── ConnectionStatus.tsx    — Indicateur Connecté/Syncing/Déconnecté
│   │   └── UndoRedoControls.tsx    — Boutons Undo/Redo + raccourcis clavier
│   ├── Sidebar/
│   │   ├── LeftSidebar.tsx         — Panneau gauche utilisateurs
│   │   ├── UserCard.tsx            — Carte utilisateur (avatar + ops + typing)
│   │   └── UserAvatar.tsx          — Avatar coloré avec initiales
│   ├── Editor/
│   │   ├── EditorPanel.tsx         — Wrapper principal de l'éditeur
│   │   ├── EditorCore.tsx          — Textarea isolée (zéro rerender parasite)
│   │   ├── LineNumbers.tsx         — Numérotation des lignes mémoïsée
│   │   ├── CursorLayer.tsx         — Overlay des curseurs multiples
│   │   ├── CursorMarker.tsx        — Marqueur visuel d'un curseur
│   │   └── LatencyIndicator.tsx    — Indicateur de latence temps réel
│   ├── RightPanel/
│   │   ├── RightPanel.tsx          — Panneau droit avec onglets
│   │   ├── ActivityLog.tsx         — Journal chronologique des opérations
│   │   └── ChatModule.tsx          — Module de chat (simulé + saisie manuelle)
│   └── Footer/
│       └── DebugConsole.tsx        — Console système (stats, mode, latence)
├── store/
│   ├── index.ts                    — Export central des slices
│   └── slices/
│       ├── documentSlice.ts        — Contenu, titre, historique undo/redo
│       ├── usersSlice.ts           — État des 3 utilisateurs
│       ├── syncSlice.ts            — Statut connexion + latence courante
│       ├── logsSlice.ts            — Journal d'activité (max 200 entrées)
│       └── chatSlice.ts            — Messages chat (max 100 entrées)
├── simulation/
│   ├── SimulationEngine.ts         — Orchestrateur principal
│   ├── NetworkSimulator.ts         — Latence + perte de paquets
│   └── OperationGenerator.ts       — Génération d'opérations insert/delete
├── hooks/
│   ├── useSimulation.ts            — Hook de démarrage/arrêt simulation
├── types/
│   └── index.ts                    — Types partagés (User, Operation, Log, Chat...)
└── utils/
    ├── colorUtils.ts               — Contraste couleur, rgba
    └── lineUtils.ts                — Calcul positions curseurs
```

---

## Architecture détaillée

### Store Zustand — Pattern Slices

Le state est découpé en **5 stores indépendants** pour éviter les rerenders croisés :

```
useDocumentStore  →  titre, contenu, historique undo/redo
useUsersStore     →  liste des users, typing, curseurs, compteurs
useSyncStore      →  statut connexion, latence ms
useLogsStore      →  journal des opérations (LIFO, max 200)
useChatStore      →  messages chat (FIFO, max 100)
```

Chaque composant ne subscribe **qu'au slice dont il a besoin**. Un changement dans `logsSlice` ne déclenche pas de rerender dans `EditorCore`.

### Stratégie de performance

| Composant | Stratégie |
|---|---|
| `EditorCore` | `memo` + `useCallback` stable — jamais rerender sur frappe |
| `LineNumbers` | `memo` avec comparateur custom — rerender seulement si nb lignes change |
| `CursorLayer` | Subscribe uniquement aux positions curseurs via `useMemo` |
| `DebugConsole` | `setInterval` 500ms — lecture directe `.getState()` sans subscribe |
| `UserCard` | Rerender uniquement si son user change (Immer garantit la référence) |

**Résultat** : lors de la saisie utilisateur, seul `EditorCore` et `EditorPanel` rerender. Les sidebars, le footer et les curseurs restent stables.

### Simulation collaborative

```
SimulationEngine
    ├── scheduleNextOp()     — Timer 1.5s–4s par user
    │       └── OperationGenerator.generate()
    │               └── NetworkSimulator.send()    — latence + perte 1%
    │                       └── applyOperation()   — setContentSilent (sans undo)
    └── scheduleNextChat()   — Timer 4s–10s par user
            └── useChatStore.addMessage()
```

Les opérations externes utilisent `setContentSilent` (pas d'historique undo) contrairement aux frappes utilisateur qui utilisent `setContent` (avec historique).

### Système Undo/Redo

- **Scope** : uniquement les modifications manuelles de l'utilisateur
- **Stockage** : deux piles `history[]` et `future[]` dans `documentSlice`
- **Cap** : 100 états maximum en mémoire
- **Raccourcis** : `Ctrl+Z` (undo) / `Ctrl+Shift+Z` (redo)

### Curseurs multiples

Les curseurs sont calculés en coordonnées pixel via `calculateCursorCoords()` en utilisant les constantes monospace :
- `CHAR_WIDTH = 8.4px` (font-mono 14px)
- `LINE_HEIGHT = 21px`

L'overlay `CursorLayer` est **absolu** et `pointer-events-none` — il ne perturbe pas la saisie.

---

## Choix techniques justifiés

**Pourquoi Zustand plutôt que Redux ?**
Beaucoup moins de boilerplate pour un découpage en slices. Avec Immer, les mutations sont lisibles et les slices restent totalement isolés.

**Pourquoi Immer ?**
Permet d'écrire des mutations directes dans les reducers Zustand sans casser l'immutabilité. Indispensable pour les opérations sur les arrays (logs, messages).

**Pourquoi pas de vrai CRDT (Yjs, Automerge) ?**
Hors scope pour une simulation. L'objectif est de démontrer la gestion de concurrence, pas d'implémenter un algorithme de résolution de conflits distribué. La simulation OT (Operational Transformation) simplifiée suffit à illustrer les concepts.

**Pourquoi `setContentSilent` pour la simulation ?**
Les opérations des utilisateurs simulés ne doivent pas polluer la pile Undo de l'utilisateur réel. Seules les frappes manuelles sont undoable.

**Pourquoi `setInterval` dans DebugConsole ?**
Évite de subscribe au store pour des stats qui n'ont pas besoin d'être temps réel. La lecture directe via `.getState()` toutes les 500ms est plus performante.

---

## Utilisation

### Navigation

| Zone | Description |
|---|---|
| **Header** | Cliquer sur le titre pour le renommer. Boutons Undo/Redo. Icône lune pour dark mode. |
| **Panneau gauche** | Liste des 3 collaborateurs. Les points animés indiquent qui écrit. |
| **Zone centrale** | Écrire librement. Les curseurs colorés des autres utilisateurs apparaissent en temps réel. |
| **Panneau droit** | Onglet Activité : journal des opérations. Onglet Chat : envoyer un message avec Entrée. |
| **Footer** | Statistiques système en temps réel (chars, lignes, latence, statut). |

### Raccourcis clavier

| Raccourci | Action |
|---|---|
| `Ctrl+Z` | Annuler la dernière action |
| `Ctrl+Shift+Z` | Rétablir |
| `Entrée` (chat) | Envoyer un message |

---

## Contraintes respectées

- ✅ 3 utilisateurs simultanés simulés (Alice, Bob, Carol)
- ✅ Latence réseau aléatoire 100ms–1500ms
- ✅ Perte de paquets 1% (visible dans les logs)
- ✅ Zéro rerender global lors de la saisie
- ✅ Mémoïsation (memo, useMemo, useCallback) sur tous les composants critiques
- ✅ Curseurs multiples sans rerender du texte
- ✅ Tailwind CSS avec Dark Mode
- ✅ Responsive design (md/lg breakpoints)
- ✅ Undo/Redo fonctionnel
- ✅ Journal d'activité chronologique
- ✅ Module de chat simulé + saisie manuelle
- ✅ Console de débogage système

---

## Auteur

**Alimi LAMIDI**
Test technique NiyiExpertise — Frontend Senior React 2025