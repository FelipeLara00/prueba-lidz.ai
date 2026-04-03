## i. Cómo resolviste la tarea

Resolví la tarea principalmente usando tecnologías con las que me siento cómodo, apoyando de agentes de IA para ir refactorizando código, haciendo consultas técnicas sobre la mejor manera de lograr los objetivos.

---

## ii. Cómo usaste la IA para desarrollar, ¿usaste algún framework?

Usé principalmente Codex para inicializar el frontend y backend, indicándole qué librerías quería usar, arquitecturas que seguir para modularizar el código y cómo ir dejándolo ordenado.

---

## iii. Qué decisiones técnicas tomaste

Decidí usar SQLite para este proyecto, ya que me resultaba lo más simple, tomando en cuenta que no era muy necesario tener un rendimiento excelente. Para el backend elegí NestJS por su capacidad de modularizar todo y que quede ordenado, usar los decoradores para limpiar la lógica que se repite en muchos casos y poder ir dejando documentados los diferentes endpoints que se crearon. Para el frontend, decidí usar Nuxt, ya que es un framework que conozco bien, y la librería NuxtUi me permite usar componentes probados y que estéticamente se ven bien.

---

## iv. Qué aspectos de la tarea pondrías en discusión y buscarías aclarar en mayor detalle. Qué asumiste en dichos casos.

El flujo para agregar un cliente no me quedó muy claro porque pedían los mensajes. Siento que se podría separar ahí la lógica para solamente crear un cliente y luego ir agregándole más mensajes. Otra cosa son las reglas de negocio que hablaban para filtrar si hacer followup o no. No me quedó claro si debía filtrar cosas del mensaje netamente como palabras inválidas o si se referían a que el mensaje tuviera sentido con el rubro. Lo que hice fue filtrar el primer mensaje para ver si contiene palabras relacionadas con el rubro (arriendo, venta, m2, uf, etc.) para ver si responder. SI el primer mensaje pasa este filtro, los siguientes se responden sí o sí para poder seguir un flujo de conversación más fluido y no que todos los mensajes tengan que tener palabras clave. Otra cosa es que el endpoint de respuesta del agente para el followup lo encontré innecesario, ya que se puede ejecutar la función luego de que llegue un mensaje de cliente, se vea si hay que responder y se responda ahí mismo, ahorrándose una consulta.

---

## v. Qué aspectos y dimensiones crees que son primordiales para un agente de IA tipo chatbot en producción. Y qué harías para asegurar que se cumplan. Responde desde una perspectiva ingenieril de ciencia de computación y producto.

Lo más importante es que el prompt responda a las necesidades del usuario y que siga un hilo todo el rato. Que las respuestas no sean lo mismo, pero escrito de maneras diferentes, y que el usuario no quede con la idea de que igual necesita hablar con una persona. Para asegurar esto, lo mejor es entregar el mayor contexto posible; de esa forma, el agente puede responder sabiendo todos los aspectos que son relevantes para generar una consulta, tomar en cuenta respuestas anteriores para saber qué fue útil y qué no. También usar palabras simples para que sea fácil entender y que al usuario le interese seguir conversando porque es capaz de llevarle el hilo a la conversación.

---

## vi. Explicación del prompt y el razonamiento utilizado.

Mi prompt primero le indica al agente que hable como un agente inmobiliario, eso automáticamente le indica el contexto de la situación y el idioma en que responder (pensando que es para Chile). También le digo que no invente información para evitar dar datos que el cliente sepa que no son reales y sienta que esto no sirve. Le paso también datos del usuario relevantes para poder tener más contexto sobre la situación económica de la persona y poder ajustar las respuestas a algo que realmente le sirva porque está dentro de sus opciones. Finalmente, le paso los mensajes anteriores para que pueda llevar el hilo de la conversación y repita respuestas que ya dio y que al usuario no le sirvieron. Esto permite avanzar en la discusión.
