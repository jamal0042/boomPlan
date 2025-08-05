// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  role_id: number;
  role?: Role; // Ajouté la relation directe avec Role
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  organizer_id: number;
  organizer?: User; // Ajouté la relation directe avec User
  category_id?: number;
  category?: EventCategory; // Ajouté la relation directe avec EventCategory
  title: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  start_datetime: string;
  end_datetime: string;
  image_url?: string;
  is_public: boolean;
  status: 'draft' | 'published' | 'cancelled';
  created_at: string;
  updated_at: string;
  tickets?: Ticket[];
  photos?: EventPhoto[];
  favorites_count?: number;
  is_favorite?: boolean; // Nouvelle propriété pour l'état de favori de l'utilisateur
}

export interface EventCategory {
  id: number;
  name: string;
  description?: string;
}

export interface EventPhoto {
  id: number;
  event_id: number;
  photo_url: string;
  uploaded_at: string;
}

export interface Ticket {
  id: number;
  event_id: number;
  type: string;
  description?: string;
  price: number;
  quantity_total: number;
  quantity_sold: number;
  sale_start?: string;
  sale_end?: string;
  is_active: boolean;
  event?: Event; // <-- AJOUTÉ : Permet d'imbriquer les détails de l'événement dans le ticket
}

export interface Order {
  id: number;
  user_id: number;
  event_id: number;
  order_datetime: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_method?: string;
  tickets?: OrderTicket[]; // Renommé de OrderTickets à tickets pour correspondre à votre code
  products?: OrderProduct[];
  // Note: Les relations Event et User ont été retirées ici par votre code fourni.
  // Si elles sont nécessaires pour l'affichage des commandes, elles devront être ajoutées.
}

export interface OrderTicket {
  id: number;
  order_id: number;
  ticket_id: number;
  quantity: number;
  ticket_code: string;
  status: 'valid' | 'used' | 'cancelled';
  ticket?: Ticket; // Ajouté la relation directe avec Ticket
}

export interface OrderProduct {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  product?: EventProduct;
}

export interface EventProduct {
  id: number;
  event_id: number;
  name: string;
  description?: string;
  price: number;
  quantity_total?: number;
  quantity_sold: number;
}

export interface PromoCode {
  id: number;
  event_id: number;
  code: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  usage_limit?: number;
  usage_count: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Attendee {
  id: number;
  event_id: number;
  user_id: number;
  user?: User;
  checkin_status: boolean;
  checkin_time?: string;
}

export interface EventTeam {
  id: number;
  event_id: number;
  user_id: number;
  user?: User;
  role: string;
}

export interface EmailCampaign {
  id: number;
  event_id: number;
  subject: string;
  content: string;
  sent_at?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string; // Type string, à adapter si vous utilisez category_id numérique
  city?: string;
  date_from?: string;
  date_to?: string;
  price_min?: number;
  price_max?: number;
  is_free?: boolean;
}

export interface CartItem {
  ticket_id: number;
  ticket: Ticket;    // Le Ticket est maintenant imbriqué
  quantity: number;
}
