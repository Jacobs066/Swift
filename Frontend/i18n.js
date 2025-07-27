import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  translation: {
    // Common
    continue: 'Continue',
    back: 'Back',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Authentication
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    forgotPassword: 'Forgot Password?',
    loginSuccess: 'Login successful!',
    signupSuccess: 'Account created successfully!',
    loginFailed: 'Login failed',
    signupFailed: 'Signup failed',
    
    // OTP Verification
    otpInfoText: 'Please enter the code that was sent to',
    enterCode: 'Enter Code',
    verifying: 'Verifying...',
    sendAnotherCode: 'Send another code',
    otpVerificationSuccess: 'OTP verified successfully!',
    otpResentSuccess: 'Code resent successfully!',
    otpVerificationFailed: 'OTP verification failed',
    otpExpired: 'OTP has expired',
    otpInvalid: 'Invalid OTP code',
    
    // Home Screen
    welcomeBack: 'Welcome back',
    balance: 'Balance',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    send: 'Send',
    transfer: 'Transfer',
    recentActivity: 'Recent Activity',
    recentTransactions: 'Recent Transactions',
    noRecentActivity: 'No recent activity',
    noRecentTransactions: 'No recent transactions',
    
    // Wallet
    myWallet: 'My Wallet',
    accountBalance: 'Account Balance',
    currency: 'Currency',
    
    // Transactions
    transactionHistory: 'Transaction History',
    transactionDetails: 'Transaction Details',
    amount: 'Amount',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    reference: 'Reference',
    recipient: 'Recipient',
    sender: 'Sender',
    method: 'Method',
    
    // Send Money
    sendMoney: 'Send Money',
    sendToBank: 'Send to Bank Account',
    sendToMobile: 'Send to Mobile Wallet',
    chooseBank: 'Choose Bank',
    accountNumber: 'Account Number',
    accountHolderName: 'Account Holder Name',
    chooseMobileNetwork: 'Choose Mobile Network',
    walletNumber: 'Wallet Number',
    recipientName: 'Recipient Name',
    enterAmount: 'Enter amount',
    enterAccountNumber: 'Enter account number',
    enterWalletNumber: 'Enter wallet number',
    enterRecipientName: 'Enter recipient name',
    
    // Deposit
    funds: 'Funds',
    chooseDepositMethod: 'Choose a method to fund your wallet.',
    depositInitiatedSuccess: 'Deposit initiated successfully!',
    failedToInitiateDeposit: 'Failed to initiate deposit',
    depositWithCard: 'Deposit with Card',
    depositWithMobile: 'Deposit with Mobile Money',
    depositWithBank: 'Deposit with Bank',
    
    // Mobile Wallet Withdrawal
    withdrawToMobileWallet: 'Withdraw to Mobile Wallet',
    selectedProvider: 'Selected Provider:',
    allFieldsRequired: 'All fields are required',
    enterValidAmount: 'Please enter a valid amount',
    withdrawalInitiatedSuccess: 'Withdrawal initiated successfully!',
    withdrawalFailed: 'Failed to initiate withdrawal',
    withdrawalReference: 'Withdrawal for school fees',
    
    // Bank Withdrawal
    withdrawToBankAccount: 'Withdraw to Bank Account',
    bankName: 'Bank Name',
    bankNamePlaceholder: 'Absa, Stanbic, etc.',
    accountNumberPlaceholder: '0123456789',
    fullNamePlaceholder: 'John Doe',
    amountPlaceholder: '200.00',
    referencePlaceholder: 'Withdrawal for savings',
    fullNameRequired: 'Full name is required',
    bankNameRequired: 'Bank name is required',
    accountNumberRequired: 'Account number is required',
    referenceRequired: 'Reference is required',
    bankWithdrawalInitiatedSuccess: 'Bank withdrawal initiated successfully!',
    bankWithdrawalFailed: 'Failed to initiate bank withdrawal',
    
    // Success Messages
    transferSuccessful: 'Transfer Successful!',
    moneySentSuccessfully: 'Your money has been sent successfully.',
    downloadReceipt: 'Download Receipt',
    shareReceipt: 'Share Receipt',
    viewTransactionHistory: 'View Transaction History',
    backToHome: 'Back to Home',
    
    // Language Selection
    chooseLanguage: 'Choose your language for Swift',
    english: 'English',
    french: 'French',
    spanish: 'Spanish',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    notifications: 'Notifications',
    security: 'Security',
    about: 'About',
    logout: 'Logout',
    changePassword: 'Change password',
    privacyData: 'Privacy & Data',
    help: 'Help',
    changeProfilePhoto: 'Change profile photo',
    aboutUs: 'About Us',
    customerService: 'Customer Service',
    user: 'User',
    noEmail: 'No email',
    noPhone: 'No phone',
    failedToLoadProfile: 'Failed to load user profile',
    
    // Notifications
    notifications: 'Notifications',
    markAllAsRead: 'Mark All as Read',
    noNotifications: 'No notifications yet',
    noNotificationsSubtext: 'We\'ll notify you when something important happens',
    transactionDetails: 'Transaction Details',
    viewFullTransaction: 'View Full Transaction',
    loadingTransactionDetails: 'Loading transaction details...',
    backToNotifications: 'Back to Notifications',
    backToHome: 'Back to Home',
    
    // Validation Messages
    pleaseSelectBank: 'Please select a bank',
    pleaseEnterValidAccountNumber: 'Please enter a valid account number (minimum 10 digits)',
    pleaseEnterAccountHolderName: 'Please enter the account holder name',
    pleaseEnterValidAmount: 'Please enter a valid amount',
    pleaseSelectMobileNetwork: 'Please select a mobile network',
    pleaseEnterValidWalletNumber: 'Please enter a valid wallet number (minimum 10 digits)',
    pleaseEnterRecipientName: 'Please enter the recipient name',
    
    // Error Messages
    failedToLoadData: 'Failed to load data',
    failedToSendMoney: 'Failed to send money',
    failedToLoadSendMethods: 'Failed to load send methods',
    failedToLoadTransactionData: 'Failed to load transaction data',
    failedToCancelTransaction: 'Failed to cancel transaction',
    failedToDownloadReceipt: 'Failed to download receipt',
    failedToShareReceipt: 'Failed to share receipt',
  }
};

// French translations
const fr = {
  translation: {
    // Common
    continue: 'Continuer',
    back: 'Retour',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Authentication
    login: 'Connexion',
    signup: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    fullName: 'Nom complet',
    phoneNumber: 'Numéro de téléphone',
    forgotPassword: 'Mot de passe oublié?',
    loginSuccess: 'Connexion réussie!',
    signupSuccess: 'Compte créé avec succès!',
    loginFailed: 'Échec de la connexion',
    signupFailed: 'Échec de l\'inscription',
    
    // OTP Verification
    otpInfoText: 'Veuillez entrer le code qui a été envoyé à',
    enterCode: 'Entrer le code',
    verifying: 'Vérification...',
    sendAnotherCode: 'Envoyer un autre code',
    otpVerificationSuccess: 'OTP vérifié avec succès!',
    otpResentSuccess: 'Code renvoyé avec succès!',
    otpVerificationFailed: 'Échec de la vérification OTP',
    otpExpired: 'OTP a expiré',
    otpInvalid: 'Code OTP invalide',
    
    // Home Screen
    welcomeBack: 'Bon retour',
    balance: 'Solde',
    deposit: 'Dépôt',
    withdraw: 'Retrait',
    send: 'Envoyer',
    transfer: 'Transfert',
    recentActivity: 'Activité récente',
    recentTransactions: 'Transactions récentes',
    noRecentActivity: 'Aucune activité récente',
    noRecentTransactions: 'Aucune transaction récente',
    
    // Wallet
    myWallet: 'Mon portefeuille',
    accountBalance: 'Solde du compte',
    currency: 'Devise',
    
    // Transactions
    transactionHistory: 'Historique des transactions',
    transactionDetails: 'Détails de la transaction',
    amount: 'Montant',
    date: 'Date',
    time: 'Heure',
    status: 'Statut',
    reference: 'Référence',
    recipient: 'Destinataire',
    sender: 'Expéditeur',
    method: 'Méthode',
    
    // Send Money
    sendMoney: 'Envoyer de l\'argent',
    sendToBank: 'Envoyer vers un compte bancaire',
    sendToMobile: 'Envoyer vers un portefeuille mobile',
    chooseBank: 'Choisir une banque',
    accountNumber: 'Numéro de compte',
    accountHolderName: 'Nom du titulaire du compte',
    chooseMobileNetwork: 'Choisir un réseau mobile',
    walletNumber: 'Numéro de portefeuille',
    recipientName: 'Nom du destinataire',
    enterAmount: 'Entrer le montant',
    enterAccountNumber: 'Entrer le numéro de compte',
    enterWalletNumber: 'Entrer le numéro de portefeuille',
    enterRecipientName: 'Entrer le nom du destinataire',
    
    // Deposit
    funds: 'Fonds',
    chooseDepositMethod: 'Choisissez une méthode pour alimenter votre portefeuille.',
    depositInitiatedSuccess: 'Dépôt initié avec succès!',
    failedToInitiateDeposit: 'Échec de l\'initiation du dépôt',
    depositWithCard: 'Dépôt avec carte',
    depositWithMobile: 'Dépôt avec Mobile Money',
    depositWithBank: 'Dépôt avec banque',
    
    // Mobile Wallet Withdrawal
    withdrawToMobileWallet: 'Retirer vers le portefeuille mobile',
    selectedProvider: 'Fournisseur sélectionné:',
    allFieldsRequired: 'Tous les champs sont requis',
    enterValidAmount: 'Veuillez entrer un montant valide',
    withdrawalInitiatedSuccess: 'Retrait initié avec succès!',
    withdrawalFailed: 'Échec de l\'initiation du retrait',
    withdrawalReference: 'Retrait pour les frais de scolarité',
    
    // Bank Withdrawal
    withdrawToBankAccount: 'Retirer vers un compte bancaire',
    bankName: 'Nom de la banque',
    bankNamePlaceholder: 'Absa, Stanbic, etc.',
    accountNumberPlaceholder: '0123456789',
    fullNamePlaceholder: 'John Doe',
    amountPlaceholder: '200.00',
    referencePlaceholder: 'Retrait pour l\'épargne',
    fullNameRequired: 'Le nom complet est requis',
    bankNameRequired: 'Le nom de la banque est requis',
    accountNumberRequired: 'Le numéro de compte est requis',
    referenceRequired: 'La référence est requise',
    bankWithdrawalInitiatedSuccess: 'Retrait bancaire initié avec succès!',
    bankWithdrawalFailed: 'Échec de l\'initiation du retrait bancaire',
    
    // Success Messages
    transferSuccessful: 'Transfert réussi!',
    moneySentSuccessfully: 'Votre argent a été envoyé avec succès.',
    downloadReceipt: 'Télécharger le reçu',
    shareReceipt: 'Partager le reçu',
    viewTransactionHistory: 'Voir l\'historique des transactions',
    backToHome: 'Retour à l\'accueil',
    
    // Language Selection
    chooseLanguage: 'Choisissez votre langue pour Swift',
    english: 'Anglais',
    french: 'Français',
    spanish: 'Espagnol',
    
    // Settings
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    notifications: 'Notifications',
    security: 'Sécurité',
    about: 'À propos',
    logout: 'Déconnexion',
    changePassword: 'Changer le mot de passe',
    privacyData: 'Confidentialité et données',
    help: 'Aide',
    changeProfilePhoto: 'Changer la photo de profil',
    aboutUs: 'À propos de nous',
    customerService: 'Service client',
    user: 'Utilisateur',
    noEmail: 'Aucun email',
    noPhone: 'Aucun téléphone',
    failedToLoadProfile: 'Échec du chargement du profil utilisateur',
    
    // Notifications
    notifications: 'Notifications',
    markAllAsRead: 'Marquer tout comme lu',
    noNotifications: 'Aucune notification pour le moment',
    noNotificationsSubtext: 'Nous vous notifierons quand quelque chose d\'important se passe',
    transactionDetails: 'Détails de la transaction',
    viewFullTransaction: 'Voir la transaction complète',
    loadingTransactionDetails: 'Chargement des détails de la transaction...',
    backToNotifications: 'Retour aux notifications',
    backToHome: 'Retour à l\'accueil',
    
    // Validation Messages
    pleaseSelectBank: 'Veuillez sélectionner une banque',
    pleaseEnterValidAccountNumber: 'Veuillez entrer un numéro de compte valide (minimum 10 chiffres)',
    pleaseEnterAccountHolderName: 'Veuillez entrer le nom du titulaire du compte',
    pleaseEnterValidAmount: 'Veuillez entrer un montant valide',
    pleaseSelectMobileNetwork: 'Veuillez sélectionner un réseau mobile',
    pleaseEnterValidWalletNumber: 'Veuillez entrer un numéro de portefeuille valide (minimum 10 chiffres)',
    pleaseEnterRecipientName: 'Veuillez entrer le nom du destinataire',
    
    // Error Messages
    failedToLoadData: 'Échec du chargement des données',
    failedToSendMoney: 'Échec de l\'envoi d\'argent',
    failedToLoadSendMethods: 'Échec du chargement des méthodes d\'envoi',
    failedToLoadTransactionData: 'Échec du chargement des données de transaction',
    failedToCancelTransaction: 'Échec de l\'annulation de la transaction',
    failedToDownloadReceipt: 'Échec du téléchargement du reçu',
    failedToShareReceipt: 'Échec du partage du reçu',
  }
};

// Spanish translations
const es = {
  translation: {
    // Common
    continue: 'Continuar',
    back: 'Atrás',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Authentication
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    fullName: 'Nombre completo',
    phoneNumber: 'Número de teléfono',
    forgotPassword: '¿Olvidaste tu contraseña?',
    loginSuccess: '¡Inicio de sesión exitoso!',
    signupSuccess: '¡Cuenta creada exitosamente!',
    loginFailed: 'Error al iniciar sesión',
    signupFailed: 'Error al registrarse',
    
    // OTP Verification
    otpInfoText: 'Por favor ingresa el código que fue enviado a',
    enterCode: 'Ingresar código',
    verifying: 'Verificando...',
    sendAnotherCode: 'Enviar otro código',
    otpVerificationSuccess: '¡OTP verificado exitosamente!',
    otpResentSuccess: '¡Código reenviado exitosamente!',
    otpVerificationFailed: 'Error en la verificación OTP',
    otpExpired: 'OTP ha expirado',
    otpInvalid: 'Código OTP inválido',
    
    // Home Screen
    welcomeBack: 'Bienvenido de vuelta',
    balance: 'Saldo',
    deposit: 'Depositar',
    withdraw: 'Retirar',
    send: 'Enviar',
    transfer: 'Transferir',
    recentActivity: 'Actividad reciente',
    recentTransactions: 'Transacciones recientes',
    noRecentActivity: 'Sin actividad reciente',
    noRecentTransactions: 'Sin transacciones recientes',
    
    // Wallet
    myWallet: 'Mi billetera',
    accountBalance: 'Saldo de la cuenta',
    currency: 'Moneda',
    
    // Transactions
    transactionHistory: 'Historial de transacciones',
    transactionDetails: 'Detalles de la transacción',
    amount: 'Monto',
    date: 'Fecha',
    time: 'Hora',
    status: 'Estado',
    reference: 'Referencia',
    recipient: 'Destinatario',
    sender: 'Remitente',
    method: 'Método',
    
    // Send Money
    sendMoney: 'Enviar dinero',
    sendToBank: 'Enviar a cuenta bancaria',
    sendToMobile: 'Enviar a billetera móvil',
    chooseBank: 'Elegir banco',
    accountNumber: 'Número de cuenta',
    accountHolderName: 'Nombre del titular de la cuenta',
    chooseMobileNetwork: 'Elegir red móvil',
    walletNumber: 'Número de billetera',
    recipientName: 'Nombre del destinatario',
    enterAmount: 'Ingresar monto',
    enterAccountNumber: 'Ingresar número de cuenta',
    enterWalletNumber: 'Ingresar número de billetera',
    enterRecipientName: 'Ingresar nombre del destinatario',
    
    // Deposit
    funds: 'Fondos',
    chooseDepositMethod: 'Elige un método para cargar tu billetera.',
    depositInitiatedSuccess: '¡Depósito iniciado con éxito!',
    failedToInitiateDeposit: 'Error al iniciar el depósito',
    depositWithCard: 'Depósito con tarjeta',
    depositWithMobile: 'Depósito con Mobile Money',
    depositWithBank: 'Depósito con banco',
    
    // Mobile Wallet Withdrawal
    withdrawToMobileWallet: 'Retirar a la billetera móvil',
    selectedProvider: 'Proveedor seleccionado:',
    allFieldsRequired: 'Todos los campos son obligatorios',
    enterValidAmount: 'Por favor ingresa un monto válido',
    withdrawalInitiatedSuccess: '¡Retiro iniciado con éxito!',
    withdrawalFailed: 'Error al iniciar el retiro',
    withdrawalReference: 'Retiro para cuotas escolares',
    
    // Bank Withdrawal
    withdrawToBankAccount: 'Retirar a cuenta bancaria',
    bankName: 'Nombre del banco',
    bankNamePlaceholder: 'Absa, Stanbic, etc.',
    accountNumberPlaceholder: '0123456789',
    fullNamePlaceholder: 'John Doe',
    amountPlaceholder: '200.00',
    referencePlaceholder: 'Retiro para ahorros',
    fullNameRequired: 'El nombre completo es obligatorio',
    bankNameRequired: 'El nombre del banco es obligatorio',
    accountNumberRequired: 'El número de cuenta es obligatorio',
    referenceRequired: 'La referencia es obligatoria',
    bankWithdrawalInitiatedSuccess: '¡Retiro bancario iniciado con éxito!',
    bankWithdrawalFailed: 'Error al iniciar el retiro bancario',
    
    // Success Messages
    transferSuccessful: '¡Transferencia exitosa!',
    moneySentSuccessfully: 'Tu dinero ha sido enviado exitosamente.',
    downloadReceipt: 'Descargar recibo',
    shareReceipt: 'Compartir recibo',
    viewTransactionHistory: 'Ver historial de transacciones',
    backToHome: 'Volver al inicio',
    
    // Language Selection
    chooseLanguage: 'Elige tu idioma para Swift',
    english: 'Inglés',
    french: 'Francés',
    spanish: 'Español',
    
    // Settings
    settings: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    about: 'Acerca de',
    logout: 'Cerrar sesión',
    changePassword: 'Cambiar contraseña',
    privacyData: 'Privacidad y datos',
    help: 'Ayuda',
    changeProfilePhoto: 'Cambiar foto de perfil',
    aboutUs: 'Acerca de nosotros',
    customerService: 'Servicio al cliente',
    user: 'Usuario',
    noEmail: 'Sin email',
    noPhone: 'Sin teléfono',
    failedToLoadProfile: 'Error al cargar el perfil del usuario',
    
    // Notifications
    notifications: 'Notificaciones',
    markAllAsRead: 'Marcar todo como leído',
    noNotifications: 'Sin notificaciones por el momento',
    noNotificationsSubtext: 'Te notificaremos cuando algo importante suceda',
    transactionDetails: 'Detalles de la transacción',
    viewFullTransaction: 'Ver transacción completa',
    loadingTransactionDetails: 'Cargando detalles de la transacción...',
    backToNotifications: 'Volver a notificaciones',
    backToHome: 'Volver al inicio',
    
    // Validation Messages
    pleaseSelectBank: 'Por favor selecciona un banco',
    pleaseEnterValidAccountNumber: 'Por favor ingresa un número de cuenta válido (mínimo 10 dígitos)',
    pleaseEnterAccountHolderName: 'Por favor ingresa el nombre del titular de la cuenta',
    pleaseEnterValidAmount: 'Por favor ingresa un monto válido',
    pleaseSelectMobileNetwork: 'Por favor selecciona una red móvil',
    pleaseEnterValidWalletNumber: 'Por favor ingresa un número de billetera válido (mínimo 10 dígitos)',
    pleaseEnterRecipientName: 'Por favor ingresa el nombre del destinatario',
    
    // Error Messages
    failedToLoadData: 'Error al cargar datos',
    failedToSendMoney: 'Error al enviar dinero',
    failedToLoadSendMethods: 'Error al cargar métodos de envío',
    failedToLoadTransactionData: 'Error al cargar datos de transacción',
    failedToCancelTransaction: 'Error al cancelar transacción',
    failedToDownloadReceipt: 'Error al descargar recibo',
    failedToShareReceipt: 'Error al compartir recibo',
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      fr,
      es
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n; 