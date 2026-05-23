-- Migration pour ajouter les champs d'adresse au profil utilisateur
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_phone TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT DEFAULT 'Cap-Haïtien';
