# F12 Migration

## Target
LivingDexHub F12.25 Beta Candidate

## Architecture
- Android WebView wrapper
- applicationId: `com.otaviobarreto.livingdex`
- Home / Pokédex / Box canonical navigation
- Central collection store
- Universal Pokémon detail
- DataDex-derived local artwork mapping for base species, forms and Mega forms
- Offline game/evolution/location data
- Android Back navigation bridge
- Native haptic bridge
- Runtime beta regression audit

## Build target
The repository will use GitHub Actions as the canonical Android build environment. Source migration must preserve the complete F12.25 asset set; the old F11.8 repository remains untouched as a fallback.
