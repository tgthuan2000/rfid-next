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
    *[_type == 'product'] | order(_createdAt desc) {
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

export const rfid = {
	GET_LIST: `
        *[_type == 'mapping'] | order(_createdAt desc) {
            _id,
            rfid,
            code_product-> {
                _id,
                name,
                barcode,
                image,
                categoryProduct-> {
                    _id,
                    name
                }
            },
            warehouse-> {
                _id,
                address,
                name
            }
        } [$start...$end]
    `,
}
