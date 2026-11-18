export interface RegisterPayload {
    email: string
    password: string
    name: string 
    phone?:string
}

export interface LoginPayload{
    email: string
    password: string
}

export interface CurrentUser{
    id: string 
    email: string
    fullName: string 
    phone?: string 
    role: 'CUSTOMER' | 'WAREHOUSE_OPERATOR' | 'ADMIN'
    status: string 
    customerInfo?: {
        customerCode:string ;
        loyaltyPoints: number ;
    }
}