export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum Tier {
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM'
}

export enum OfferCategory {
    RESTAURANTS = 'RESTAURANTS',
    TOURISM = 'TOURISM',
    MARKETPLACES = 'MARKETPLACES',
    SUBSCRIPTIONS = 'SUBSCRIPTIONS',
    GAMES = 'GAMES',
    COURSES = 'COURSES',
    FITNESS = 'FITNESS',
    OTHER = 'OTHER'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    ACTIVATED = 'ACTIVATED',
    DISPUTED = 'DISPUTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum DisputeStatus {
    OPEN = 'OPEN',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}
