import type { Invoice, EmailMessage, User, GmailConnection, UpdateInvoiceRequest, InvoiceFilters, PaginationParams, CreateInvoiceRequest } from '../types';

// Default mock data to populate localStorage if empty
const DEFAULT_USER: User = {
  id: 'usr_1',
  clerkId: 'user_clerk_123',
  email: 'omkar@smartspend.io',
  name: 'Omkar',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  updatedAt: new Date().toISOString()
};

export interface MockCategory {
  name: string;
  color: string; // 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red'
  budget: number;
}

const DEFAULT_CATEGORIES: MockCategory[] = [
  { name: 'Food & Drinks', color: 'orange', budget: 8000 },
  { name: 'Transportation', color: 'blue', budget: 4000 },
  { name: 'Hosting & Cloud', color: 'purple', budget: 12000 },
  { name: 'Software Tools', color: 'pink', budget: 5000 },
  { name: 'Shopping', color: 'yellow', budget: 6000 },
  { name: 'Utilities', color: 'gray', budget: 3000 }
];

const DEFAULT_INVOICES = (userId: string): Invoice[] => [
  {
    id: 'inv_1',
    userId,
    vendor: 'Starbucks Coffee',
    invoiceNumber: 'STB-8912',
    invoiceDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
    totalAmount: 380.00,
    currency: 'INR',
    category: 'Food & Drinks',
    rawText: 'Starbucks Coffee India. Order #5931. 1x Cappuccino Tall, 1x Butter Croissant. Total: ₹380.00. Paid via UPI.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_2',
    userId,
    vendor: 'Uber Rides',
    invoiceNumber: 'UBR-9021',
    invoiceDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    totalAmount: 420.00,
    currency: 'INR',
    category: 'Transportation',
    rawText: 'Uber India. Trip details: HSR Layout to Indiranagar. Distance: 8.2 km. Total Fare: ₹420.00. Paid via Paytm.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_3',
    userId,
    vendor: 'Amazon Web Services',
    invoiceNumber: 'AWS-2026-06',
    invoiceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
    totalAmount: 6850.00,
    currency: 'INR',
    category: 'Hosting & Cloud',
    rawText: 'Amazon Web Services EMEA SARL. Invoice Date: 2026-06-08. Usage charge for EC2: ₹4500, S3: ₹1200, RDS: ₹1150. Total: ₹6850.00.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_4',
    userId,
    vendor: 'GitHub',
    invoiceNumber: 'GH-SUB-231',
    invoiceDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
    totalAmount: 830.00,
    currency: 'INR',
    category: 'Software Tools',
    rawText: 'GitHub, Inc. GitHub Copilot Individual Subscription. $10.00 USD converted to ₹830.00. Charged to Visa ending in 4321.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_5',
    userId,
    vendor: 'Figma Pro',
    invoiceNumber: 'FIG-7834',
    invoiceDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days ago
    totalAmount: 1250.00,
    currency: 'INR',
    category: 'Software Tools',
    rawText: 'Figma Inc. Monthly Professional Plan. $15.00 USD. Total: ₹1250.00. Paid via Credit Card.',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_6',
    userId,
    vendor: 'Amazon.in Retail',
    invoiceNumber: 'AMZ-4921-IN',
    invoiceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days ago
    totalAmount: 2499.00,
    currency: 'INR',
    category: 'Shopping',
    rawText: 'Amazon Seller Services Private Limited. Order #402-9382103. 1x Ergonomic Laptop Stand. Total: ₹2499.00. Paid via NetBanking.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'inv_7',
    userId,
    vendor: 'HackerNews Premium',
    invoiceNumber: 'HN-890',
    invoiceDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 25 days ago
    totalAmount: 150.00,
    currency: 'INR',
    category: 'Shopping',
    rawText: 'Y Combinator HN Books. 1x Sticker pack, 1x Newsletter subscription. Total: ₹150.00.',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_EMAILS = (userId: string): EmailMessage[] => [
  {
    id: 'msg_1',
    gmailMessageId: 'g_msg_101',
    subject: 'Your Swiggy Order Receipt - Pizza Hut',
    sender: 'orders@swiggy.in',
    snippet: 'Thank you for your order! Your delicious pizza is on its way. Details: 1x Medium Double Cheese Margherita, 1x Garlic Bread. Total Amount Paid: INR 580.00.',
    receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    processed: false,
    userId,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_2',
    gmailMessageId: 'g_msg_102',
    subject: 'Your Friday Evening Ride with Uber',
    sender: 'uber.india@uber.com',
    snippet: 'Thanks for riding, Omkar! We hope you enjoyed your ride. Details: Pickup: Koramangala, Dropoff: Indiranagar. Total Charged: INR 490.00. Payment: Uber Auto UPI.',
    receivedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    processed: false,
    userId,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_3',
    gmailMessageId: 'g_msg_103',
    subject: 'Google One: Your subscription has renewed',
    sender: 'googleone-noreply@google.com',
    snippet: 'Good news! Your Google One membership has renewed successfully. Storage: 100 GB. Price: INR 130.00 / month. Charged to: VISA **5678. Thank you for your payment.',
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    processed: false,
    userId,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_4',
    gmailMessageId: 'g_msg_104',
    subject: 'Spotify Premium Family Renewal',
    sender: 'no-reply@spotify.com',
    snippet: 'Receipt for your Spotify Premium Family plan. Renewed on: 2026-06-10. Price: INR 199.00. Enjoy your music!',
    receivedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    processed: true,
    userId,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg_5',
    gmailMessageId: 'g_msg_105',
    subject: 'Order Confirmation - BookMyShow',
    sender: 'tickets@bookmyshow.com',
    snippet: 'Booking Confirmed! Movie: Spider-Man: Beyond the Spider-Verse. Seats: F10, F11 (INOX HSR Layout). Total Paid: INR 720.00. Date: 2026-06-11 18:30.',
    receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    processed: false,
    userId,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

class MockDb {
  private getStorageItem<T>(key: string, defaultVal: T): T {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(data);
  }

  private setStorageItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // User CRUD
  getUser(): User {
    return this.getStorageItem<User>('smartspend_user', DEFAULT_USER);
  }

  updateUser(name: string, email: string): User {
    const user = this.getUser();
    const updated = { ...user, name, email, updatedAt: new Date().toISOString() };
    this.setStorageItem('smartspend_user', updated);
    return updated;
  }

  // Categories CRUD
  getCategories(): MockCategory[] {
    return this.getStorageItem<MockCategory[]>('smartspend_categories', DEFAULT_CATEGORIES);
  }

  addCategory(category: MockCategory): MockCategory[] {
    const categories = this.getCategories();
    if (categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
      throw new Error('Category already exists');
    }
    const updated = [...categories, category];
    this.setStorageItem('smartspend_categories', updated);
    return updated;
  }

  updateCategoryBudget(name: string, budget: number): MockCategory[] {
    const categories = this.getCategories();
    const updated = categories.map(c => c.name === name ? { ...c, budget } : c);
    this.setStorageItem('smartspend_categories', updated);
    return updated;
  }

  deleteCategory(name: string): MockCategory[] {
    const categories = this.getCategories();
    const updated = categories.filter(c => c.name !== name);
    this.setStorageItem('smartspend_categories', updated);
    return updated;
  }

  // Expenses (Invoices) CRUD
  getInvoices(filters?: InvoiceFilters): Invoice[] {
    const user = this.getUser();
    let invoices = this.getStorageItem<Invoice[]>('smartspend_invoices', DEFAULT_INVOICES(user.id));

    // Sort by date descending by default
    invoices = invoices.sort((a, b) => new Date(b.invoiceDate || b.createdAt).getTime() - new Date(a.invoiceDate || a.createdAt).getTime());

    if (filters) {
      if (filters.vendor) {
        const vendorQuery = filters.vendor.toLowerCase();
        invoices = invoices.filter(inv => inv.vendor.toLowerCase().includes(vendorQuery));
      }
      if (filters.category) {
        const categoryQuery = filters.category.toLowerCase();
        invoices = invoices.filter(inv => inv.category?.toLowerCase() === categoryQuery);
      }
    }
    return invoices;
  }

  getInvoiceById(id: string): Invoice {
    const invoices = this.getInvoices();
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error(`Expense with ID ${id} not found`);
    }
    return invoice;
  }

  createInvoice(data: CreateInvoiceRequest): Invoice {
    const user = this.getUser();
    const invoices = this.getInvoices();

    const newInvoice: Invoice = {
      id: 'inv_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      vendor: data.vendor,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate || new Date().toISOString().split('T')[0],
      totalAmount: Number(data.totalAmount),
      currency: data.currency || 'INR',
      category: data.category || 'Uncategorized',
      rawText: data.rawText || '',
      createdAt: new Date().toISOString()
    };

    invoices.push(newInvoice);
    this.setStorageItem('smartspend_invoices', invoices);

    // Make sure category exists in database
    const categories = this.getCategories();
    if (data.category && !categories.some(c => c.name.toLowerCase() === data.category!.toLowerCase())) {
      this.addCategory({
        name: data.category,
        color: ['blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'gray'][Math.floor(Math.random() * 7)],
        budget: 5000
      });
    }

    return newInvoice;
  }

  updateInvoice(id: string, data: UpdateInvoiceRequest): Invoice {
    const invoices = this.getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error(`Expense with ID ${id} not found`);
    }

    const updatedInvoice: Invoice = {
      ...invoices[index],
      ...data,
      totalAmount: data.totalAmount !== undefined ? Number(data.totalAmount) : invoices[index].totalAmount
    };

    invoices[index] = updatedInvoice;
    this.setStorageItem('smartspend_invoices', invoices);

    // If category was changed and doesn't exist, create it
    if (data.category) {
      const categories = this.getCategories();
      if (!categories.some(c => c.name.toLowerCase() === data.category!.toLowerCase())) {
        this.addCategory({
          name: data.category,
          color: ['blue', 'green', 'purple', 'orange', 'pink', 'yellow', 'gray'][Math.floor(Math.random() * 7)],
          budget: 5000
        });
      }
    }

    return updatedInvoice;
  }

  deleteInvoice(id: string): void {
    const invoices = this.getInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    this.setStorageItem('smartspend_invoices', filtered);
  }

  // Gmail Connections
  isGmailConnected(): boolean {
    return this.getStorageItem<boolean>('smartspend_gmail_connected', true);
  }

  setGmailConnected(connected: boolean): void {
    this.setStorageItem('smartspend_gmail_connected', connected);
  }

  getGmailConnection(): GmailConnection | null {
    const connected = this.isGmailConnected();
    if (!connected) return null;
    return {
      id: 'conn_1',
      userId: this.getUser().id,
      googleEmail: this.getUser().email,
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Email Messages
  getEmailMessages(): EmailMessage[] {
    const user = this.getUser();
    return this.getStorageItem<EmailMessage[]>('smartspend_emails', DEFAULT_EMAILS(user.id));
  }

  processEmailMessage(messageId: string): EmailMessage {
    const emails = this.getEmailMessages();
    const idx = emails.findIndex(e => e.id === messageId);
    if (idx === -1) throw new Error('Email message not found');

    const email = emails[idx];
    if (email.processed) return email;

    // Process: Parse invoice details from subject/snippet
    let vendor = 'Unknown';
    let amount = 0;
    let category = 'Uncategorized';

    if (email.subject?.toLowerCase().includes('swiggy')) {
      vendor = 'Swiggy';
      category = 'Food & Drinks';
    } else if (email.subject?.toLowerCase().includes('uber')) {
      vendor = 'Uber';
      category = 'Transportation';
    } else if (email.subject?.toLowerCase().includes('google one')) {
      vendor = 'Google One';
      category = 'Software Tools';
    } else if (email.subject?.toLowerCase().includes('bookmyshow')) {
      vendor = 'BookMyShow';
      category = 'Shopping';
    }

    // Try to extract amount
    const amtMatch = email.snippet?.match(/(?:INR|Rs\.|₹)\s*(\d+(?:\.\d{2})?)/i);
    if (amtMatch) {
      amount = parseFloat(amtMatch[1]);
    }

    // Update email
    email.processed = true;
    emails[idx] = email;
    this.setStorageItem('smartspend_emails', emails);

    // Create Invoice
    this.createInvoice({
      vendor,
      totalAmount: amount || 200,
      currency: 'INR',
      category,
      rawText: `Processed from Gmail: ${email.subject}. Snippet: ${email.snippet}`,
      invoiceDate: new Date().toISOString().split('T')[0]
    });

    return email;
  }

  syncGmailEmails(): EmailMessage[] {
    // Check if connected
    if (!this.isGmailConnected()) {
      throw new Error('Gmail is not connected. Please connect Gmail first.');
    }

    // Simply reload the default list or add a new mock unread email
    const emails = this.getEmailMessages();
    const user = this.getUser();

    // Create a new mock receipt if we don't have too many
    if (emails.filter(e => !e.processed).length < 5) {
      const randomId = Math.random().toString(36).substr(2, 5);
      const newEmail: EmailMessage = {
        id: 'msg_' + randomId,
        gmailMessageId: 'g_msg_' + randomId,
        subject: 'Your order confirmation - Zomato / Meal',
        sender: 'noreply@zomato.com',
        snippet: `Thank you for ordering lunch! Items: 1x Paneer Butter Masala, 2x Roti. Paid online: INR 320.00. Delivered to HSR Office.`,
        receivedAt: new Date().toISOString(),
        processed: false,
        userId: user.id,
        createdAt: new Date().toISOString()
      };
      emails.unshift(newEmail);
      this.setStorageItem('smartspend_emails', emails);
    }
    return emails;
  }

  // Stats Calculations
  getExpenseStats(): {
    totalExpenses: number;
    monthlyExpenses: number;
    categoriesBreakdown: Record<string, number>;
  } {
    const invoices = this.getInvoices();
    let total = 0;
    let monthly = 0;
    const breakdown: Record<string, number> = {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    invoices.forEach(inv => {
      const amount = inv.totalAmount;
      total += amount;

      const date = inv.invoiceDate ? new Date(inv.invoiceDate) : new Date(inv.createdAt);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        monthly += amount;
      }

      const category = inv.category || 'Uncategorized';
      breakdown[category] = (breakdown[category] || 0) + amount;
    });

    return {
      totalExpenses: total,
      monthlyExpenses: monthly,
      categoriesBreakdown: breakdown
    };
  }

  // Reset database to initial defaults
  reset(): void {
    localStorage.removeItem('smartspend_user');
    localStorage.removeItem('smartspend_invoices');
    localStorage.removeItem('smartspend_emails');
    localStorage.removeItem('smartspend_categories');
    localStorage.removeItem('smartspend_gmail_connected');

    // Trigger window reload to apply changes
    window.location.reload();
  }
}

export const mockDb = new MockDb();
export default mockDb;
