import { getDatabase } from './src/lib/shoxau-database.js';
import * as ownerPremiumDb from './src/lib/shoxau-premium-db.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION OBJECT
// ═══════════════════════════════════════════════════════════════════════════
//  utamakan baca object config sampai bawah

const config = {
  info: {
    website: process.env.BOT_WEBSITE || '',
    grupwa: process.env.BOT_GROUP_LINK || ''
  },

  owner: {
    name: process.env.BOT_OWNER_NAME || 'Owner Shoxau',
    number: (process.env.BOT_OWNER_NUMBERS || '').split(',').map(number => number.trim()).filter(Boolean)
  },

  session: {
    pairingNumber: process.env.BOT_PAIRING_NUMBER || '',
    usePairingCode: process.env.BOT_USE_PAIRING_CODE !== 'false',
    printQRInTerminal: true
  },

  bot: {
    name: process.env.BOT_NAME || 'Shoxau',
    version: '0.1.0',
    developer: process.env.BOT_DEVELOPER || 'Shoxau Team'
  },

  mode: process.env.BOT_MODE || 'public',

  command: {
    prefix: '.'
  },

  nhefinance: {
    enabled: process.env.NHEFINANCE_ENABLED === 'true',
    baseUrl: process.env.NHEFINANCE_BASE_URL || '',
    linkPageUrl: process.env.NHEFINANCE_LINK_PAGE_URL || '',
    serviceSecret: process.env.NHEFINANCE_BOT_SERVICE_SECRET || '',
    reminderPollMs: Number(process.env.NHEFINANCE_REMINDER_POLL_MS) || 60000
  },

  vercel: {
    // ambil token vercel: https://vercel.com/account/tokens
    token: process.env.VERCEL_TOKEN || ''
  },

  store: {
    payment: [],
    qris: process.env.STORE_QRIS_URL || ''
  },

  donasi: {
    payment: [],
    links: [],
    benefits: [
      'Mendukung pengembangan Shoxau',
      'Membantu menjaga layanan tetap stabil',
      'Mendukung pengembangan fitur'
    ],
    qris: process.env.DONATION_QRIS_URL || ''
  },

  energi: {
    enabled: false,                   // Jika true, maka sistem energi/limit akan bekerja
    default: 99999,
    premium: 99999999,
    owner: -1
  },

  sticker: {
    packname: process.env.STICKER_PACK_NAME || 'Shoxau',
    author: process.env.STICKER_AUTHOR || 'Shoxau Bot'
  },

  saluran: {
    id: process.env.BOT_CHANNEL_ID || '',
    name: process.env.BOT_CHANNEL_NAME || 'Shoxau',
    link: process.env.BOT_CHANNEL_LINK || ''
  },

  groupProtection: {
        antilink: '⚠ *Antilink* — @%user% mengirim link.\nPesan dihapus.',
        antilinkKick: '⚠ *Antilink* — @%user% di-kick karena mengirim link.',
        antilinkGc: '⚠ *Antilink WA* — @%user% mengirim link WA.\nPesan dihapus.',
        antilinkGcKick: '⚠ *Antilink WA* — @%user% di-kick karena mengirim link WA.',
        antilinkAll: '⚠ *Antilink* — @%user% mengirim link.\nPesan dihapus.',
        antilinkAllKick: '⚠ *Antilink* — @%user% di-kick karena mengirim link.',
        antitagsw: '⚠ *AntiTagSW* — Tag status dari @%user% dihapus.',
        antiviewonce: '👁️ *ViewOnce* — Dari @%user%',
        antiremove: '🗑️ *AntiDelete* — @%user% menghapus pesan:',
        antihidetag: '⚠ *AntiHidetag* — Hidetag dari @%user% dihapus.',
        antitoxicWarn: '⚠ @%user% berkata kasar.\nPeringatan ke %warn% dari %max%, pelanggaran berikutnya bisa di-%method%.',
        antitoxicAction: '🚫 @%user% di-%method% karena toxic. (%warn%/%max%)',
        antidocument: '⚠ *AntiDocument* — Dokumen dari @%user% dihapus.',
        antisticker: '⚠ *AntiSticker* — Sticker dari @%user% dihapus.',
        antimedia: '⚠ *AntiMedia* — Media dari @%user% dihapus.',
        antibot: '🤖 *AntiBot* — @%user% terdeteksi sebagai bot dan di-kick.',
        notAdmin: '⚠ Bot bukan admin, tidak bisa menghapus pesan.'
    },

  errorTemplate: `☢ Kayaknya command \`{prefix}{command}\` lagi ada kendala
Silahkan coba lagi nanti, {pushName}

_Jika masalah berlanjut, silahkan hubungi owner bot_`,

  features: {
    antiSpam: true,
    antiSpamInterval: 3000,
    antiCall: true,                   // Jika true, bot akan menolak panggilan masuk
    blockIfCall: true,                // Jika true, bot akan memblokir nomor yang menelpon bot
    autoTyping: true,
    autoRead: false,
    logMessage: true,
    dailyLimitReset: true,
    smartTriggers: false
  },

  registration: {
    enabled: false,                   // Jika true, user harus mendaftar sebelum menggunakan bot
    rewards: {
      koin: 30000,
      energi: 300,
      exp: 300000
    }
  },

  welcome: { defaultEnabled: false },
  goodbye: { defaultEnabled: false },

  ui: {
    menuVariant: 3
  },

  messages: {
    wait: '🕕 *Proses...* Mohon tunggu sebentar ya.',
    success: '✅ *Berhasil!* Permintaan kamu sudah selesai.',
    error: '❌ *Error!* Ada masalah pada sistem, coba lagi nanti.',

    ownerOnly: '*Akses Ditolak!* Fitur ini khusus untuk Owner bot.',
    premiumOnly: '💎 *Premium Only!* Fitur ini khusus member Premium. Ketik *.benefitpremium* untuk info upgrade.',

    groupOnly: '👥 *Group Only!* Fitur ini hanya bisa digunakan di dalam grup.',
    privateOnly: '🔒 *Private Only!* Fitur ini hanya bisa digunakan di chat pribadi bot.',

    adminOnly: '🛡️ *Admin Only!* Kamu harus jadi Admin grup untuk pakai fitur ini.',
    botAdminOnly: '🤖 *Bot Bukan Admin!* Jadikan bot sebagai Admin grup dulu biar bisa kerja.',

    cooldown: '🕕 *Tunggu Dulu!* Kamu masih dalam cooldown. Tunggu %time% detik lagi ya.',
    energiExceeded: '⚡ *Energi Habis!* Energi kamu sudah habis. Tunggu reset besok atau beli Premium.',

    banned: '🚫 *Kamu Dibanned!* Kamu tidak bisa menggunakan bot ini karena telah melanggar aturan.',

    rejectCall: '🚫 JANGAN TELPON NOMOR INI WEH',
  },

  database: { path: './database/main' },
  backup: { enabled: false, intervalHours: 24, retainDays: 7 },
  scheduler: { resetHour: 0, resetMinute: 0 },

  // Dev mode settings (auto-enabled jika NODE_ENV=development)
  dev: {
    enabled: process.env.NODE_ENV === 'development',
    watchPlugins: true,               // Hot reload plugin (SAFE)
    watchSrc: false,                  // DISABLED - src reload causes connection conflict 440
    debugLog: false                   // Show stack traces
  },

  // Kredensial panel dibaca dari environment; kosongkan yang tidak digunakan.
  pterodactyl: {
    server1: {
      domain: process.env.PTERODACTYL_SERVER1_DOMAIN || '',
      apikey: process.env.PTERODACTYL_SERVER1_API_KEY || '',
      capikey: process.env.PTERODACTYL_SERVER1_CLIENT_API_KEY || '',
      egg: process.env.PTERODACTYL_SERVER1_EGG || '15',
      nestid: process.env.PTERODACTYL_SERVER1_NEST_ID || '5',
      location: process.env.PTERODACTYL_SERVER1_LOCATION || '1'
    },
    server2: {
      domain: process.env.PTERODACTYL_SERVER2_DOMAIN || '',
      apikey: process.env.PTERODACTYL_SERVER2_API_KEY || '',
      capikey: process.env.PTERODACTYL_SERVER2_CLIENT_API_KEY || '',
      egg: process.env.PTERODACTYL_SERVER2_EGG || '15',
      nestid: process.env.PTERODACTYL_SERVER2_NEST_ID || '5',
      location: process.env.PTERODACTYL_SERVER2_LOCATION || '1'
    },
    server3: {
      domain: process.env.PTERODACTYL_SERVER3_DOMAIN || '',
      apikey: process.env.PTERODACTYL_SERVER3_API_KEY || '',
      capikey: process.env.PTERODACTYL_SERVER3_CLIENT_API_KEY || '',
      egg: process.env.PTERODACTYL_SERVER3_EGG || '15',
      nestid: process.env.PTERODACTYL_SERVER3_NEST_ID || '5',
      location: process.env.PTERODACTYL_SERVER3_LOCATION || '1'
    },
    server4: {
      domain: process.env.PTERODACTYL_SERVER4_DOMAIN || '',
      apikey: process.env.PTERODACTYL_SERVER4_API_KEY || '',
      capikey: process.env.PTERODACTYL_SERVER4_CLIENT_API_KEY || '',
      egg: process.env.PTERODACTYL_SERVER4_EGG || '15',
      nestid: process.env.PTERODACTYL_SERVER4_NEST_ID || '5',
      location: process.env.PTERODACTYL_SERVER4_LOCATION || '1'
    },
    server5: {
      domain: process.env.PTERODACTYL_SERVER5_DOMAIN || '',
      apikey: process.env.PTERODACTYL_SERVER5_API_KEY || '',
      capikey: process.env.PTERODACTYL_SERVER5_CLIENT_API_KEY || '',
      egg: process.env.PTERODACTYL_SERVER5_EGG || '15',
      nestid: process.env.PTERODACTYL_SERVER5_NEST_ID || '5',
      location: process.env.PTERODACTYL_SERVER5_LOCATION || '1'
    }
  },

  digitalocean: {
    token: process.env.DIGITALOCEAN_TOKEN || '',
    region: process.env.DIGITALOCEAN_REGION || 'sgp1',
    sellers: [],
    ownerPanels: []
  },

  // NOTE: ini di versi free gak ada yak, adanya cuma di sc pt doang
  //  daftar di: https://pakasir.com/
  pakasir: {
    enabled: process.env.PAKASIR_ENABLED === 'true',
    slug: process.env.PAKASIR_SLUG || '',
    apiKey: process.env.PAKASIR_API_KEY || '',
    defaultMethod: 'qris',
    sandbox: false,
    pollingInterval: 5000
  },

  // NOTE: ini di versi free gak ada yak, adanya cuma di sc pt doang
  // Ambil apikey di: https://ditznesia.id -> Daftar -> Masuk ke Profile -> AMbile Apikey
  jasaotp: {
    apiKey: process.env.JASAOTP_API_KEY || '',
    markup: 2000,
    timeout: 300
  },

  // NOTE: kalau mau command "autoai" nya berfungsi, ini gak wajib di isi yak
  // ambil apikey di: https://aistudio.google.com/apikey
  geminiApiKey: process.env.GEMINI_API_KEY || '',

  //  APIkey
  APIkey: {
    lolhuman: process.env.LOLHUMAN_API_KEY || '',
    neoxr: process.env.NEOXR_API_KEY || '',
    fgsi: process.env.FGSI_API_KEY || '',
    google: process.env.GOOGLE_API_KEY || '',
    groq: process.env.GROQ_API_KEY || '',
    betabotz: process.env.BETABOTZ_API_KEY || '',
    covenant: process.env.COVENANT_API_KEY || ''
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// NUMBER UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Membersihkan nomor dari karakter non-digit dan memisahkan bagian sebelum `:`
 * @param {string} number - Nomor mentah
 * @returns {string} Nomor yang sudah dibersihkan
 */
function cleanNumber(number) {
  if (!number) return '';
  return String(number).split(':')[0].split('@')[0].replace(/[^0-9]/g, '');
}

/**
 * Memeriksa apakah dua nomor cocok (exact, suffix, atau prefix match)
 * @param {string} a - Nomor pertama (sudah dibersihkan)
 * @param {string} b - Nomor kedua (sudah dibersihkan)
 * @returns {boolean}
 */
function isNumberMatch(a, b) {
  if (!a || !b) return false;
  return a === b || a.endsWith(b) || b.endsWith(a);
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLE CHECKERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cek apakah nomor adalah owner
 * @param {string} number - Nomor WA
 * @returns {boolean}
 */
function isOwner(number) {
  if (!number) return false;
  const cleanNum = number.split(':')[0].replace(/[^0-9]/g, '');
  if (!cleanNum) return false;

  // Cek bot number
  if (config.bot?.number) {
    const botNum = config.bot.number.replace(/[^0-9]/g, '');
    if (botNum && (cleanNum.includes(botNum) || botNum.includes(cleanNum))) return true;
  }

  try {
    const db = getDatabase();

    // Cek dari config.owner.number
    if (config.owner?.number) {
      const match = config.owner.number.some((own) => {
        const c = own.replace(/[^0-9]/g, '');
        return c && isNumberMatch(cleanNum, c);
      });
      if (match) return true;
    }

    // Cek dari database.data.owner
    if (db?.data && Array.isArray(db.data.owner)) {
      const match = db.data.owner.some((own) => {
        const c = String(own).replace(/[^0-9]/g, '');
        return c && isNumberMatch(cleanNum, c);
      });
      if (match) return true;
    }

    // Cek dari db.setting('ownerNumbers')
    if (db) {
      const definedOwner = db.setting('ownerNumbers');
      if (Array.isArray(definedOwner)) {
        const match = definedOwner.some((own) => {
          const c = String(own).replace(/[^0-9]/g, '');
          return c && isNumberMatch(cleanNum, c);
        });
        if (match) return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Cek apakah nomor adalah premium
 * @param {string} number - Nomor WA
 * @returns {boolean}
 */
function isPremium(number) {
  if (!number) return false;
  if (isOwner(number)) return true;

  const cleanNum = cleanNumber(number);
  const premiumList = config.premiumUsers || [];

  // Cek dari config.premiumUsers
  const inConfig = premiumList.some((premium) => {
    if (!premium) return false;
    const cleanPremium = cleanNumber(premium);
    return isNumberMatch(cleanNum, cleanPremium);
  });
  if (inConfig) return true;

  // Cek dari ownerPremiumDb
  try {
    if (ownerPremiumDb && ownerPremiumDb.isPremium(cleanNum)) return true;
  } catch {}

  // Cek dari database
  try {
    const db = getDatabase();
    if (db && db.data && Array.isArray(db.data.premium)) {
      const now = Date.now();
      const foundIndex = db.data.premium.findIndex((p) => {
        if (typeof p === 'string') return p === cleanNum;
        if (p.id) return p.id === cleanNum;
        return false;
      });

      if (foundIndex !== -1) {
        const found = db.data.premium[foundIndex];
        if (typeof found === 'string') return true;

        const expireTime = found.expired || (found.expiredAt ? new Date(found.expiredAt).getTime() : 0);
        if (expireTime && expireTime < now) {
          db.data.premium.splice(foundIndex, 1);
          const jid = cleanNum + '@s.whatsapp.net';
          const user = db.getUser(jid);
          if (user) { user.isPremium = false; db.setUser(jid, user); }
          db.save();
          return false;
        }
        return true;
      }
    }

    if (db) {
      const savedPremium = db.setting('premiumUsers') || [];
      const inDb = savedPremium.some((premium) => {
        if (!premium) return false;
        const cleanPremium = cleanNumber(premium);
        return isNumberMatch(cleanNum, cleanPremium);
      });
      if (inDb) return true;
    }
  } catch {}

  return false;
}

/**
 * Cek apakah nomor adalah partner
 * @param {string} number - Nomor WA
 * @returns {boolean}
 */
function isPartner(number) {
  if (!number) return false;
  if (isOwner(number)) return true;

  const cleanNum = cleanNumber(number);
  const partnerList = config.partnerUsers || [];

  // Cek dari config.partnerUsers
  const inConfig = partnerList.some((partner) => {
    if (!partner) return false;
    const cleanPartner = cleanNumber(partner);
    return isNumberMatch(cleanNum, cleanPartner);
  });
  if (inConfig) return true;

  // Cek dari ownerPremiumDb
  try {
    if (ownerPremiumDb && ownerPremiumDb.isPartner(cleanNum)) return true;
  } catch {}

  // Cek dari database
  try {
    const db = getDatabase();
    if (db && db.data && Array.isArray(db.data.partner)) {
      const now = Date.now();
      const foundIndex = db.data.partner.findIndex((p) => {
        if (typeof p === 'string') return p === cleanNum;
        if (p.id) return p.id === cleanNum;
        return false;
      });

      if (foundIndex !== -1) {
        const found = db.data.partner[foundIndex];
        if (typeof found === 'string') return true;

        const expireTime = found.expired || (found.expiredAt ? new Date(found.expiredAt).getTime() : 0);
        if (expireTime && expireTime < now) {
          db.data.partner.splice(foundIndex, 1);
          db.save();
          return false;
        }
        return true;
      }
    }
  } catch {}

  return false;
}

/**
 * Cek apakah nomor dibanned
 * @param {string} number - Nomor WA
 * @returns {boolean}
 */
function isBanned(number) {
  if (!number) return false;
  if (isOwner(number)) return false;

  const cleanNum = cleanNumber(number);

  let bannedList = [];
  try {
    const db = getDatabase();
    if (db) {
      bannedList = db.setting('bannedUsers') || [];
      config.bannedUsers = bannedList;
    }
  } catch {}

  return bannedList.some((banned) => {
    const cleanBanned = cleanNumber(banned);
    return isNumberMatch(cleanNum, cleanBanned);
  });
}

/**
 * Set nomor bot
 * @param {string} number - Nomor bot
 */
function setBotNumber(number) {
  if (number) config.bot.number = number.replace(/[^0-9]/g, '');
}

/**
 * Cek apakah nomor adalah bot itu sendiri
 * @param {string} number - Nomor WA
 * @returns {boolean}
 */
function isSelf(number) {
  if (!number || !config.bot.number) return false;
  const cleanNum = number.replace(/[^0-9]/g, '');
  const botNum = config.bot.number.replace(/[^0-9]/g, '');
  return cleanNum.includes(botNum) || botNum.includes(cleanNum);
}

/**
 * Get config object
 * @returns {Object}
 */
function getConfig() {
  return config;
}


// ═══════════════════════════════════════════════════════════════════════════
// ATTACH HELPERS TO CONFIG & EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

config.isOwner = isOwner;
config.isPremium = isPremium;
config.isPartner = isPartner;
config.isBanned = isBanned;
config.setBotNumber = setBotNumber;
config.isSelf = isSelf;

export default config;
export { config, getConfig, isOwner, isPartner, isPremium, isBanned, setBotNumber, isSelf };
