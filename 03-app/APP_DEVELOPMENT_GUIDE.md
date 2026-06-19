---
type: operational
status: active
priority: P1
module: mobile
tags: [development, troubleshooting, mobile]
updated: 2026-06-18
---

# 🛠️ DEVELOPMENT_GUIDE (App Móvil)
## Guía de Desarrollo Diario y Troubleshooting

> [!info] Consultar
> Para comandos del día a día, decisiones ad-hoc que no merecen un ADR formal, y problemas conocidos con su solución.

---

## 1. Comandos Frecuentes

```bash
# Ejecutar en modo desarrollo
flutter run --flavor dev --dart-define=API_BASE_URL=http://localhost:8080/api/v1

# Generación de código en watch mode (dejar corriendo durante desarrollo activo)
dart run build_runner watch --delete-conflicting-outputs

# Análisis estático + tests antes de cualquier commit
flutter analyze && flutter test

# Limpiar build cacheado cuando algo "raro" pasa tras actualizar dependencias
flutter clean && flutter pub get

# Ver dispositivos/emuladores disponibles
flutter devices
```

---

## 2. Decisiones Ad-Hoc

> Registrar aquí decisiones pequeñas que no justifican un ADR completo (ver [[APP_ARCHITECTURE]] §11 para el criterio de cuándo sí se necesita un ADR formal), pero que el equipo debe recordar.

_(Sin entradas aún — se completa a medida que el equipo tome decisiones durante el desarrollo: ej. elección final entre `flutter_flavorizr` vs `--dart-define`, elección final de CI de firma, paquete específico de detección de root/jailbreak, etc.)_

---

## 3. Problemas Conocidos y Soluciones

| Síntoma | Causa probable | Solución |
|---|---|---|
| Login funciona pero el refresh token expira en 7 días en vez de 30 | El cliente no está enviando un `User-Agent` que matchee la regex móvil del backend | Ver [[APP_API_INTEGRATION]] §2 — verificar que `AuthInterceptor` setea el header explícitamente |
| Golden tests fallan en CI pero pasan en local | Diferencia de fuentes del sistema entre máquina local y runner de CI | Fijar la imagen/fuentes del runner de CI, ver [[APP_TESTING]] §3.3 |
| `localhost` no conecta desde un dispositivo físico durante desarrollo | `localhost` apunta al propio dispositivo, no a la máquina de desarrollo | Usar la IP de red local de la máquina o un túnel (`ngrok`) — ver [[APP_SETUP_GUIDE]] §5 |
| Build de release crashea solo en modo release, no en debug | Comportamiento típico de problemas de obfuscation/tree-shaking o de código que depende de asserts que se eliminan en release | Probar con `flutter run --release` localmente antes de asumir que es un problema de las tiendas |
| `pumpAndSettle` nunca termina en un test de una pantalla con stream en vivo (chat) | Hay una animación o stream que nunca se "asienta" | Usar `pump(Duration(...))` explícito en vez de `pumpAndSettle`, ver [[APP_TESTING]] §3.2 |

---

## 4. Convención de Commits y Branches

_(A definir por el equipo — sugerencia consistente con el backend si ese repo usa Conventional Commits: `feat(auth): ...`, `fix(reservations): ...`, branches `feature/`, `fix/`, `chore/`.)_

---

## 5. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_SESSION_MANIFEST]] | Estado formal entre sesiones (distinto de esta guía, que es acumulativa y de referencia rápida) |
| [[APP_SETUP_GUIDE]] | Configuración inicial completa |
| [[APP_TESTING]] | Detalle de la suite de pruebas |
