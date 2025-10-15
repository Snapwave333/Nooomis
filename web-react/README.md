# NOOOMIS React + Tailwind

A modern React + Tailwind CSS implementation of the NOOOMIS Simon Says game.

## Features

- **Classic Mode**: Traditional Simon Says gameplay with precise timing
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly
- **Modern UI**: Clean design with Tailwind CSS and custom design tokens
- **Audio**: WebAudio API with proper fade in/out to prevent audio pops
- **Responsive**: Works on desktop and mobile devices
- **Performance**: Optimized animations with reduced motion support

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Controls

- **Mouse/Touch**: Click pads to play
- **Keyboard**: 
  - `1`, `Q`, `←` for Green pad
  - `2`, `W`, `↑` for Red pad  
  - `3`, `E`, `↓` for Blue pad
  - `4`, `R`, `→` for Yellow pad

## Game Modes

Currently supports Classic mode with:
- 700ms tone duration
- 300ms gap between tones
- 3 starting lives
- Score multiplier of 10 per round
- Streak bonus of 20 points after 5 consecutive rounds

## Architecture

- **Components**: Modular React components with TypeScript
- **Hooks**: Custom hooks for game logic, audio, and keyboard input
- **State Management**: React state with proper state machine
- **Audio**: WebAudio API for precise timing and audio quality
- **Storage**: localStorage for persistence
- **Styling**: Tailwind CSS with custom design tokens

## Development

The project uses:
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- WebAudio API for audio
- Custom hooks for game logic

## Accessibility

- Full ARIA support with proper labels and live regions
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support for users with vestibular disorders
- High contrast mode support (planned)