import ProductRepository from '../repositories/ProductRepository.js';
import ProductDTO from '../dtos/ProductDTO.js'; 


 const createProduct = async (req, res) => {
    try {
        const { code } = req.body;

        const existingProduct = await ProductRepository.getByCode(code);
        if (existingProduct) {
            return res.status(400).json({
                error: 'Producto duplicado',
                message: `Ya existe un producto con el código: ${code}`,
                details: {
                    campoDuplicado: 'code',
                    valorDuplicado: code,
                    productIdExistente: existingProduct._id
                },
                suggestion: 'Utiliza un código único para cada producto'
            });
        }

        const product = await ProductRepository.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            product: new ProductDTO(product)
        });
    } catch (error) {
        console.error('Error creando producto:', error);

        if (error.message.includes('Ya existe un producto')) {
            return res.status(400).json({
                error: 'Producto duplicado',
                message: error.message,
                suggestion: 'Utiliza un código único para cada producto'
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Datos de producto inválidos',
                message: 'Error de validación',
                details: errors,
                suggestion: 'Verifica que todos los campos requeridos estén completos y en el formato correcto'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo crear el producto',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

 const getProducts = async (req, res) => {
    try {
        const products = await ProductRepository.getAll();
        res.json({
            success: true,
            count: products.length,
            products: products.map(product => new ProductDTO(product))
        });
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudieron obtener los productos'
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await ProductRepository.update(req.params.pid, req.body);
        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado',
                message: `No se encontró un producto con ID: ${req.params.pid}`,
                suggestion: 'Verifica el ID del producto'
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            product: new ProductDTO(product) 
        });
    } catch (error) {
        console.error('Error actualizando producto:', error);

        if (error.message.includes('Ya existe un producto')) {
            return res.status(400).json({
                error: 'Código duplicado',
                message: error.message,
                suggestion: 'Utiliza un código único para cada producto'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo actualizar el producto'
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await ProductRepository.delete(req.params.pid);
        if (!product) {
            return res.status(404).json({
                error: 'Producto no encontrado',
                message: `No se encontró un producto con ID: ${req.params.pid}`
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente',
            deletedProduct: new ProductDTO(product) 
        });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo eliminar el producto'
        });
    }
};

export default {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
};