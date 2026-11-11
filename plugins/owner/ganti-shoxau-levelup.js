import fs from 'fs'
import path from 'path'
import te from '../../src/lib/shoxau-error.js'
const pluginConfig = {
    name: 'ganti-Shoxau-levelup.jpg',
    alias: ['gantiShoxaulevelup', 'setShoxaulevelup'],
    category: 'owner',
    description: 'Ganti gambar Shoxau-levelup.jpg',
    usage: '.ganti-Shoxau-levelup.jpg (reply/kirim gambar)',
    example: '.ganti-Shoxau-levelup.jpg',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ OURIN-LEVELUP.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/Shoxau-levelup.jpg`)
    try {
        let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
        if (!buffer) return m.reply('❌ Gagal mendownload gambar')
        const targetPath = path.join(process.cwd(), 'assets', 'images', 'Shoxau-levelup.jpg')
        fs.writeFileSync(targetPath, buffer)
        m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar Shoxau-levelup.jpg telah diganti`)
    } catch (error) {
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }