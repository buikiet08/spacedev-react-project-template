const PROFILE = '/ca-nhan'

export const PATH = {
    Home: '/',
    Product:'/san-pham',
    ProductDetail:'/:slug',
    Category:'/:slug/:id',
    ViewCart:'/gio-hang',
    Checkout:'/checkout',
    Contact:'/lien-he',
    OrderComplete:'/dat-hang-thanh-cong/:id',
    Profile: {
        index:PROFILE,
        Order: PROFILE + '/don-hang',
        OrderDetail: PROFILE + '/don-hang/:id',
        Wishlist: PROFILE + '/san-pham-yeu-thich',
        Address: PROFILE + '/so-dia-chi',
        NewAddress: PROFILE + '/so-dia-chi/new',
        EditAddress: PROFILE + '/so-dia-chi/edit/:id',
        Payment: PROFILE + '/so-thanh-toan',
        NewPayment: PROFILE + '/so-thanh-toan/new',
        EditPayment: PROFILE + '/so-thanh-toan/edit/:id',
    },
    About:'/about',
    Return:'/quy-dinh-giao-hang',
    Faq:'/faq',
    Account:'/tai-khoan',
    ResetPassword:'/reset-password'
}