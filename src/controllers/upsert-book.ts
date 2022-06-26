export function upsertBookController(books: any[], newBook: any) {
	const bookIndex = books.findIndex((el) => el.id === newBook.id);
	if (bookIndex === -1) {
		books.push(newBook);
	} else {
		books[bookIndex] = {
			...books[bookIndex],
			...newBook,
		};
	}
	return books;
}
