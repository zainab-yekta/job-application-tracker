// Every status an application can have, in the order it usually moves through them
export const STATUSES = ['Applied', 'Interview', 'Rejected', 'Offer', 'Accepted Offer'];

export const isOfferStatus = (status) => status === 'Offer' || status === 'Accepted Offer';

// 'Accepted Offer' -> 'accepted-offer', used for the colored status labels
export const statusClassName = (status) =>
  status ? status.toLowerCase().replace(/\s+/g, '-') : 'na';
