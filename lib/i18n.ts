export type Language = 'es' | 'en' | 'pt'

export const LANGUAGES: Record<Language, { code: Language; label: string; native: string }> = {
  es: { code: 'es', label: 'Español', native: 'Español' },
  en: { code: 'en', label: 'English', native: 'English' },
  pt: { code: 'pt', label: 'Português', native: 'Português' },
}

export const DEFAULT_LANGUAGE: Language = 'es'

export type TranslationKey = keyof Translations

export interface Translations {
  // Common
  appName: string
  home: string
  products: string
  cart: string
  checkout: string
  admin: string
  contact: string
  language: string
  save: string
  cancel: string
  delete: string
  edit: string
  add: string
  search: string
  loading: string
  error: string
  success: string
  back: string

  // Header
  storeName: string
  whatsappContact: string

  // Home
  noProducts: string
  addToCart: string
  outOfStock: string
  relatedProducts: string
  noRelatedProducts: string

  // Product detail
  description: string
  stockAvailable: string
  units: string
  outOfStockShort: string
  addToCartShort: string
  quantity: string
  backToStore: string

  // Cart
  cartTitle: string
  cartEmpty: string
  addProducts: string
  viewProducts: string
  total: string
  finishPurchase: string
  sendOrderByWhatsapp: string
  processing: string

  // Checkout
  checkoutTitle: string
  deliveryInfo: string
  fullName: string
  phone: string
  address: string
  apartment: string
  orderSummary: string
  sendOrder: string
  emptyCart: string
  addProductsToContinue: string

  // Admin
  adminTitle: string
  loginTitle: string
  password: string
  login: string
  incorrectPassword: string
  authError: string
  logout: string
  managing: string
  productsTab: string
  bannersTab: string
  infoTab: string
  addProduct: string
  productName: string
  price: string
  productDescription: string
  stock: string
  image: string
  imageUrlPlaceholder: string
  max1mb: string
  addProductBtn: string
  adding: string
  productList: string
  noProductsAdmin: string
  productStock: string
  confirmDeleteProduct: string
  deleteProductError: string
  addBanner: string
  bannerTitle: string
  bannerLink: string
  bannerLinkPlaceholder: string
  addBannerBtn: string
  addingBanner: string
  activeBanners: string
  noBanners: string
  confirmDeleteBanner: string
  deleteBannerError: string
  storeInfo: string
  storeConfig: string
  storeNameLabel: string
  storeDescriptionLabel: string
  storeIconLabel: string
  storeOgImageLabel: string
  whatsappLabel: string
  saveConfig: string
  saving: string
  configSaved: string
  configError: string
  configLoadedFromServer: string

  // Push notifications
  enableNotifications: string
  disableNotifications: string
  subscribeError: string

  // Install app
  installApp: string
  installAppDesc: string
  installNow: string

  // Footer
  rightsReserved: string

  // Not found
  notFound: string
  pageNotFound: string
  pageNotFoundDesc: string
  goHome: string
  viewProductsBtn: string
}

const es: Translations = {
  appName: 'Mi Tienda',
  home: 'Inicio',
  products: 'Productos',
  cart: 'Carrito',
  checkout: 'Finalizar compra',
  admin: 'Administración',
  contact: 'Contactar',
  language: 'Idioma',
  save: 'Guardar',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  edit: 'Editar',
  add: 'Agregar',
  search: 'Buscar',
  loading: 'Cargando...',
  error: 'Error',
  success: 'Éxito',
  back: 'Volver',

  storeName: 'Mi Tienda',
  whatsappContact: 'Contactar por WhatsApp',

  noProducts: 'No hay productos disponibles',
  addToCart: 'Agregar al carrito',
  outOfStock: 'Sin stock',
  relatedProducts: 'Productos relacionados',
  noRelatedProducts: 'No hay productos relacionados disponibles',

  description: 'Descripción',
  stockAvailable: 'Stock disponible:',
  units: 'unidades',
  outOfStockShort: 'Sin stock',
  addToCartShort: 'Agregar al carrito',
  quantity: 'Cantidad',
  backToStore: 'Volver a la tienda',

  cartTitle: 'Carrito de compras',
  cartEmpty: 'Tu carrito está vacío',
  addProducts: 'Agrega productos para continuar con tu compra',
  viewProducts: 'Ver productos',
  total: 'Total:',
  finishPurchase: 'Finalizar compra',
  sendOrderByWhatsapp: 'Enviar pedido por WhatsApp',
  processing: 'Procesando...',

  checkoutTitle: 'Finalizar compra',
  deliveryInfo: 'Información de entrega',
  fullName: 'Nombre completo',
  phone: 'Teléfono',
  address: 'Dirección',
  apartment: 'Nro. Apto/Casa',
  orderSummary: 'Resumen del pedido',
  sendOrder: 'Enviar pedido por WhatsApp',
  emptyCart: 'Tu carrito está vacío',
  addProductsToContinue: 'Agrega productos para continuar con tu compra',

  adminTitle: 'Panel de Administración',
  loginTitle: 'Panel de Administración',
  password: 'Contraseña',
  login: 'Iniciar sesión',
  incorrectPassword: 'Contraseña incorrecta',
  authError: 'Error al autenticar',
  logout: 'Cerrar sesión',
  managing: 'Gestionando',
  productsTab: 'Productos',
  bannersTab: 'Banners',
  infoTab: 'Info',
  addProduct: 'Agregar Producto',
  productName: 'Nombre',
  price: 'Precio',
  productDescription: 'Descripción del producto',
  stock: 'Cantidad en stock',
  image: 'Imagen',
  imageUrlPlaceholder: 'https://ejemplo.com/imagen.jpg',
  max1mb: 'Máx. 1MB. O ingresa una URL:',
  addProductBtn: 'Agregar Producto',
  adding: 'Agregando...',
  productList: 'Productos',
  noProductsAdmin: 'No hay productos disponibles',
  productStock: 'Stock:',
  confirmDeleteProduct: '¿Estás seguro de eliminar este producto?',
  deleteProductError: 'Error al eliminar producto',
  addBanner: 'Agregar Banner Promocional',
  bannerTitle: 'Título',
  bannerLink: 'Link (opcional)',
  bannerLinkPlaceholder: 'https://ejemplo.com/oferta',
  addBannerBtn: 'Agregar Banner',
  addingBanner: 'Agregando...',
  activeBanners: 'Banners Activos',
  noBanners: 'No hay banners disponibles',
  confirmDeleteBanner: '¿Estás seguro de eliminar este banner?',
  deleteBannerError: 'Error al eliminar banner',
  storeInfo: 'Información de configuración',
  storeConfig: 'Configuración de la tienda',
  storeNameLabel: 'Nombre de la tienda',
  storeDescriptionLabel: 'Descripción (meta)',
  storeIconLabel: 'Icono (ruta o URL)',
  storeOgImageLabel: 'OG Image (ruta o URL)',
  whatsappLabel: 'WhatsApp (ej: +56912345678)',
  saveConfig: 'Guardar',
  saving: 'Guardando...',
  configSaved: 'Configuración guardada',
  configError: 'Error al guardar',
  configLoadedFromServer: 'Nota: estos datos provienen del servidor. Si cambias variables en Portainer, reinicia el contenedor para aplicar cambios.',

  enableNotifications: 'Activar Avisos',
  disableNotifications: 'Desactivar Avisos',
  subscribeError: 'Error al suscribirse a las notificaciones',

  installApp: 'Instalar aplicación',
  installAppDesc: 'Instala nuestra app para un acceso más rápido y notificaciones de nuevos productos.',
  installNow: 'Instalar ahora',

  rightsReserved: 'Derechos Reservados',

  notFound: '404',
  pageNotFound: 'Página no encontrada',
  pageNotFoundDesc: 'Lo sentimos, la página que buscas no existe o ha sido movida.',
  goHome: 'Ir al inicio',
  viewProductsBtn: 'Ver productos',
}

const en: Translations = {
  appName: 'My Store',
  home: 'Home',
  products: 'Products',
  cart: 'Cart',
  checkout: 'Checkout',
  admin: 'Administration',
  contact: 'Contact',
  language: 'Language',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  search: 'Search',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  back: 'Back',

  storeName: 'My Store',
  whatsappContact: 'Contact via WhatsApp',

  noProducts: 'No products available',
  addToCart: 'Add to cart',
  outOfStock: 'Out of stock',
  relatedProducts: 'Related products',
  noRelatedProducts: 'No related products available',

  description: 'Description',
  stockAvailable: 'Stock available:',
  units: 'units',
  outOfStockShort: 'Out of stock',
  addToCartShort: 'Add to cart',
  quantity: 'Quantity',
  backToStore: 'Back to store',

  cartTitle: 'Shopping Cart',
  cartEmpty: 'Your cart is empty',
  addProducts: 'Add products to continue with your purchase',
  viewProducts: 'View products',
  total: 'Total:',
  finishPurchase: 'Finish purchase',
  sendOrderByWhatsapp: 'Send order by WhatsApp',
  processing: 'Processing...',

  checkoutTitle: 'Checkout',
  deliveryInfo: 'Delivery information',
  fullName: 'Full name',
  phone: 'Phone',
  address: 'Address',
  apartment: 'Apt / House No.',
  orderSummary: 'Order summary',
  sendOrder: 'Send order by WhatsApp',
  emptyCart: 'Your cart is empty',
  addProductsToContinue: 'Add products to continue with your purchase',

  adminTitle: 'Admin Panel',
  loginTitle: 'Admin Panel',
  password: 'Password',
  login: 'Sign in',
  incorrectPassword: 'Incorrect password',
  authError: 'Authentication error',
  logout: 'Sign out',
  managing: 'Managing',
  productsTab: 'Products',
  bannersTab: 'Banners',
  infoTab: 'Info',
  addProduct: 'Add Product',
  productName: 'Name',
  price: 'Price',
  productDescription: 'Product description',
  stock: 'Stock quantity',
  image: 'Image',
  imageUrlPlaceholder: 'https://example.com/image.jpg',
  max1mb: 'Max 1MB. Or enter a URL:',
  addProductBtn: 'Add Product',
  adding: 'Adding...',
  productList: 'Products',
  noProductsAdmin: 'No products available',
  productStock: 'Stock:',
  confirmDeleteProduct: 'Are you sure you want to delete this product?',
  deleteProductError: 'Error deleting product',
  addBanner: 'Add Promotional Banner',
  bannerTitle: 'Title',
  bannerLink: 'Link (optional)',
  bannerLinkPlaceholder: 'https://example.com/offer',
  addBannerBtn: 'Add Banner',
  addingBanner: 'Adding...',
  activeBanners: 'Active Banners',
  noBanners: 'No banners available',
  confirmDeleteBanner: 'Are you sure you want to delete this banner?',
  deleteBannerError: 'Error deleting banner',
  storeInfo: 'Configuration information',
  storeConfig: 'Store settings',
  storeNameLabel: 'Store name',
  storeDescriptionLabel: 'Description (meta)',
  storeIconLabel: 'Icon (path or URL)',
  storeOgImageLabel: 'OG Image (path or URL)',
  whatsappLabel: 'WhatsApp (e.g. +56912345678)',
  saveConfig: 'Save',
  saving: 'Saving...',
  configSaved: 'Configuration saved',
  configError: 'Error saving',
  configLoadedFromServer: 'Note: this data comes from the server. If you change variables in Portainer, restart the container to apply changes.',

  enableNotifications: 'Enable Notifications',
  disableNotifications: 'Disable Notifications',
  subscribeError: 'Error subscribing to notifications',

  installApp: 'Install app',
  installAppDesc: 'Install our app for faster access and new product notifications.',
  installNow: 'Install now',

  rightsReserved: 'Rights Reserved',

  notFound: '404',
  pageNotFound: 'Page not found',
  pageNotFoundDesc: "Sorry, the page you're looking for doesn't exist or has been moved.",
  goHome: 'Go home',
  viewProductsBtn: 'View products',
}

const pt: Translations = {
  appName: 'Minha Loja',
  home: 'Início',
  products: 'Produtos',
  cart: 'Carrinho',
  checkout: 'Finalizar compra',
  admin: 'Administração',
  contact: 'Contato',
  language: 'Idioma',
  save: 'Salvar',
  cancel: 'Cancelar',
  delete: 'Excluir',
  edit: 'Editar',
  add: 'Adicionar',
  search: 'Buscar',
  loading: 'Carregando...',
  error: 'Erro',
  success: 'Sucesso',
  back: 'Voltar',

  storeName: 'Minha Loja',
  whatsappContact: 'Contatar pelo WhatsApp',

  noProducts: 'Nenhum produto disponível',
  addToCart: 'Adicionar ao carrinho',
  outOfStock: 'Sem estoque',
  relatedProducts: 'Produtos relacionados',
  noRelatedProducts: 'Não há produtos relacionados disponíveis',

  description: 'Descrição',
  stockAvailable: 'Estoque disponível:',
  units: 'unidades',
  outOfStockShort: 'Sem estoque',
  addToCartShort: 'Adicionar ao carrinho',
  quantity: 'Quantidade',
  backToStore: 'Voltar à loja',

  cartTitle: 'Carrinho de compras',
  cartEmpty: 'Seu carrinho está vazio',
  addProducts: 'Adicione produtos para continuar com sua compra',
  viewProducts: 'Ver produtos',
  total: 'Total:',
  finishPurchase: 'Finalizar compra',
  sendOrderByWhatsapp: 'Enviar pedido pelo WhatsApp',
  processing: 'Processando...',

  checkoutTitle: 'Finalizar compra',
  deliveryInfo: 'Informações de entrega',
  fullName: 'Nome completo',
  phone: 'Telefone',
  address: 'Endereço',
  apartment: 'Nº Apto/Casa',
  orderSummary: 'Resumo do pedido',
  sendOrder: 'Enviar pedido pelo WhatsApp',
  emptyCart: 'Seu carrinho está vazio',
  addProductsToContinue: 'Adicione produtos para continuar com sua compra',

  adminTitle: 'Painel de Administração',
  loginTitle: 'Painel de Administração',
  password: 'Senha',
  login: 'Entrar',
  incorrectPassword: 'Senha incorreta',
  authError: 'Erro ao autenticar',
  logout: 'Sair',
  managing: 'Gerenciando',
  productsTab: 'Produtos',
  bannersTab: 'Banners',
  infoTab: 'Info',
  addProduct: 'Adicionar Produto',
  productName: 'Nome',
  price: 'Preço',
  productDescription: 'Descrição do produto',
  stock: 'Quantidade em estoque',
  image: 'Imagem',
  imageUrlPlaceholder: 'https://exemplo.com/imagem.jpg',
  max1mb: 'Máx. 1MB. Ou insira uma URL:',
  addProductBtn: 'Adicionar Produto',
  adding: 'Adicionando...',
  productList: 'Produtos',
  noProductsAdmin: 'Nenhum produto disponível',
  productStock: 'Estoque:',
  confirmDeleteProduct: 'Tem certeza de que deseja excluir este produto?',
  deleteProductError: 'Erro ao excluir produto',
  addBanner: 'Adicionar Banner Promocional',
  bannerTitle: 'Título',
  bannerLink: 'Link (opcional)',
  bannerLinkPlaceholder: 'https://exemplo.com/oferta',
  addBannerBtn: 'Adicionar Banner',
  addingBanner: 'Adicionando...',
  activeBanners: 'Banners Ativos',
  noBanners: 'Não há banners disponíveis',
  confirmDeleteBanner: 'Tem certeza de que deseja excluir este banner?',
  deleteBannerError: 'Erro ao excluir banner',
  storeInfo: 'Informações de configuração',
  storeConfig: 'Configurações da loja',
  storeNameLabel: 'Nome da loja',
  storeDescriptionLabel: 'Descrição (meta)',
  storeIconLabel: 'Ícone (caminho ou URL)',
  storeOgImageLabel: 'Imagem OG (caminho ou URL)',
  whatsappLabel: 'WhatsApp (ex: +56912345678)',
  saveConfig: 'Salvar',
  saving: 'Salvando...',
  configSaved: 'Configuração salva',
  configError: 'Erro ao salvar',
  configLoadedFromServer: 'Nota: esses dados vêm do servidor. Se você mudar variáveis no Portainer, reinicie o contêiner para aplicar as mudanças.',

  enableNotifications: 'Ativar Notificações',
  disableNotifications: 'Desativar Notificações',
  subscribeError: 'Erro ao se inscrever nas notificações',

  installApp: 'Instalar aplicativo',
  installAppDesc: 'Instale nosso aplicativo para acesso mais rápido e notificações de novos produtos.',
  installNow: 'Instalar agora',

  rightsReserved: 'Todos os Direitos Reservados',

  notFound: '404',
  pageNotFound: 'Página não encontrada',
  pageNotFoundDesc: 'Desculpe, a página que você procura não existe ou foi movida.',
  goHome: 'Ir ao início',
  viewProductsBtn: 'Ver produtos',
}

const dictionaries: Record<Language, Translations> = { es, en, pt }

export function getTranslations(language: Language): Translations {
  return dictionaries[language] ?? dictionaries[DEFAULT_LANGUAGE]
}

export function isValidLanguage(lang: string): lang is Language {
  return lang === 'es' || lang === 'en' || lang === 'pt'
}
