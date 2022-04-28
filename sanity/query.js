export const product = {
	GET_ALL: `
        *[_type == 'product'] {
            _id,
            _createAt,
            name,
            barcode,
            slug,
            description,
            image,
            price,
            quantity,
            categoryProduct-> {
                _id,
                name
            }
        }
    `,

	GET_LIST: `
    *[_type == 'product'] {
        _id,
        _createAt,
        name,
        barcode,
        slug,
        description,
        image,
        price,
        quantity,
        categoryProduct-> {
            _id,
            name
        }
    } [$start...$end]
`,

	GET_ONE: `
    *[_type == 'product' && slug.current == $slug] {
        _id,
        _createAt,
        name,
        barcode,
        slug,
        description,
        image,
        price,
        quantity,
        categoryProduct-> {
            _id,
            name
        }
    }
`,
}

export const categoryProduct = {
	GET_ALL: `
        *[_type == 'categoryProduct'] {
            _id,
            name
        }
    `,
}
