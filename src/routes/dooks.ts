import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { upsertBookController } from '../controllers/upsert-book';

const book = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	
});
type book = Static<typeof book>;

const GetBooksQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetBooksQuery = Static<typeof GetBooksQuery>;

export let books: book[] = [
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'java'},
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'clean code' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'network' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: 'frontend' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'backend'},
	
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/books',
		schema: {
			summary: 'Creates new book + all properties are required',
			tags: ['books'],
			body: book,
		},
		handler: async (request, reply) => {
			const newBook: any = request.body;
			return upsertBookController(books, newBook);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/books/:id',
		schema: {
			summary: 'Update a book by id + you dont need to pass all properties',
			tags: ['books'],
			body: Type.Partial(book),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newBook: any = request.body;
			return upsertBookController(books, newBook);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/books/:id',
		schema: {
			summary: 'Deletes a book',
			tags: ['book'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			books = books.filter((c) => c.id !== id);

			return book;
		},
	});

	server.route({
		method: 'GET',
		url: '/books/:id',
		schema: {
			summary: 'Returns one book or null',
			tags: ['book'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([book, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return books.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/books',
		schema: {
			summary: 'Gets all books',
			tags: ['books'],
			querystring: GetBooksQuery,
			response: {
				'2xx': Type.Array(book),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetBooksQuery;

			if (query.name) {
				return books.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return book;
			}
		},
	});
}
