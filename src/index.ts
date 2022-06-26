import { server } from './server';

const port: any = process.env.PORT ?? process.env.$PORT ?? 3000;

server
	.listen({
		port: port,
		host: '0.0.0.0',
	})
	.catch((err) => {
		server.log.error(err);
		process.exit(1);
	});
