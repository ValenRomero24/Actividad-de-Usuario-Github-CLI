//Funcion que busca la actividad reciente del usuario recibido en CLI
async function buscarActividadGitHub(usuario){
	const url = `https://api.github.com/users/${usuario}/events`;
	const response = await fetch(
		url,
		{
			headers: {
				"User-Agent":"node.js",
		},
	},
	);

	if (!response.ok){
		if(response.status === 404){
			throw new Error("Usuario no encontrado. Revise el nombre de usuario")
		} else{
			throw new Error(`Error fetching data: ${response.status}`);
		}
	}
	return response.json();
}

//Funcion que muestra la actividad reciente con un mensaje amigable
function mostrarActividad(events) {
	if (events.length === 0){
		console.log("No se encontró actividad reciente.");
		return;
	}

	events.forEach((event) => {
		let action;
		let nombreEvento = event.repo.name;
		switch(event.type) {
			case "PushEvent":
				const contadorCommits = event.payload.commits.length;
				action =`Pushed ${contadorCommits} commit(s) a ${event.repo.name}`;
				break;
			case "IssuesEvent":
				action = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${nombreEvento}`;
				break;
			case "WatchEvent":
				action = `Starred ${nombreEvento}`;
				break;
			case "ForkEvent":
				action = `Forked ${nombreEvento}`;
				break;
			case "CreateEvent":
				action = `Created ${event.payload.ref_type} in ${nombreEvento}`;
				break;
		}
		console.log(`-${action}`);
	});
}

//Logica principal del CLI
const nombreUsuario = process.argv[2];
if (!nombreUsuario) {
	console.error("Por favor ingrese un nombre de usuario de GitHub.");
	process.exit(1);
}

buscarActividadGitHub(nombreUsuario)
	.then((events)=> {
		mostrarActividad(events);
	})
	.catch((err)=> {
		console.error(err.message);
		process.exit(1);
	});