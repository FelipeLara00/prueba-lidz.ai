# THOUGHTS

## i. Cómo resolví la tarea
Resolví la tarea con tecnologías que manejo bien y apoyándome en agentes de IA para refactorizar código y resolver dudas técnicas puntuales. La IA me ayudó a iterar más rápido, pero las decisiones finales de arquitectura y comportamiento las fui validando sobre el código.

## ii. Cómo usé la IA para desarrollar (y si usé algún framework)
Usé principalmente Codex para inicializar frontend y backend, definiendo librerías, arquitectura y convenciones de modularización. El objetivo fue mantener una base ordenada desde el inicio y facilitar cambios posteriores sin romper el flujo.

## iii. Decisiones técnicas que tomé
- **Base de datos:** elegí SQLite por simplicidad y rapidez de implementación para el alcance de esta prueba.
- **Backend:** usé NestJS por su estructura modular, uso de decoradores y separación clara de responsabilidades.
- **Frontend:** usé Nuxt porque lo conozco bien, y Nuxt UI para construir una interfaz consistente con componentes probados.

## iv. Aspectos que pondría en discusión y supuestos que tomé
Algunos puntos de la consigna eran ambiguos:
- **Flujo de creación de cliente:** no quedaba completamente claro si los mensajes debían crearse siempre junto al cliente o en un paso posterior.
- **Reglas de negocio para follow-up:** no era explícito si el filtro debía ser solo por palabras clave o por intención/contexto del mensaje.

Supuestos aplicados:
- Filtré el **primer mensaje** por términos del rubro inmobiliario (por ejemplo: arriendo, venta, m2, UF).
- Si el primer mensaje pasa ese filtro, los siguientes mensajes se responden para mantener continuidad conversacional.
- Consideré que parte del flujo de follow-up podría resolverse en el mismo ciclo de mensajes del cliente, para evitar llamadas innecesarias.

## v. Qué es clave para un chatbot de IA en producción y cómo lo aseguraría
Desde una perspectiva de ingeniería y producto, lo más importante es:
- **Relevancia de respuesta:** que el agente responda con contexto real del usuario.
- **Coherencia conversacional:** mantener el hilo sin repetir respuestas vacías.
- **Calidad y claridad:** respuestas simples, útiles y accionables.
- **Confiabilidad:** evitar alucinaciones y respuestas inventadas.

Para asegurar esto:
- incluir contexto estructurado en cada interacción,
- versionar y evaluar prompts,
- instrumentar métricas (latencia, tasa de resolución, reintentos, satisfacción),
- agregar validaciones de seguridad y reglas de negocio antes de responder.

## vi. Explicación del prompt y razonamiento utilizado
El prompt define al agente como asesor inmobiliario en español y le indica explícitamente no inventar información. Además, incorpora datos financieros relevantes del cliente y el historial de mensajes para que la respuesta sea contextual y útil.

Con ese enfoque:
- el agente entiende el dominio desde el inicio,
- adapta la respuesta a la situación económica del cliente,
- y mantiene continuidad con lo ya conversado, evitando respuestas repetidas o desconectadas.
