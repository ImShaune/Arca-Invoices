export type UserRole = "admin" | "user" | "viewer";

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    company_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Company {
    id: string;
    name: string;
    cuit: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
    arca_cert: string | null;
    arca_key: string | null;
    arca_point_of_sale: number | null;
    created_at: string;
    updated_at: string;
}

export interface Client {
    id: string;
    company_id: string;
    name: string;
    cuit: string | null;
    dni: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    tax_condition: TaxCondition;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    company_id: string;
    name: string;
    description: string | null;
    price: number;
    vat_rate: VatRate;
    category: string | null;
    internal_code: string | null;
    stock: number | null;
    unit: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface Invoice {
    id: string;
    company_id: string;
    client_id: string;
    client?: Client;
    number: number;
    type: InvoiceType;
    point_of_sale: number;
    date: string;
    due_date: string | null;
    subtotal: number;
    vat_amount: number;
    total: number;
    status: InvoiceStatus;
    cae: string | null;
    cae_expiry: string | null;
    notes: string | null;
    items?: InvoiceItem[];
    created_at: string;
    updated_at: string;
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    product_id: string | null;
    product?: Product;
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: VatRate;
    subtotal: number;
    vat_amount: number;
    total: number;
}

// Enums
export type TaxCondition =
    | "responsable_inscripto"
    | "monotributista"
    | "exento"
    | "consumidor_final"
    | "no_categorizado";

export type VatRate = 0 | 10.5 | 21 | 27;

export type InvoiceType = "A" | "B" | "C" | "M";

export type InvoiceStatus =
    | "draft"
    | "emitted"
    | "cancelled"
    | "overdue";

// Utilidades genéricas
export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}