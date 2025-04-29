const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataDir = path.join(__dirname, 'data');
const contactsFilePath = path.join(dataDir, 'contacts.json');

// 确保 data 文件夹存在
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// 确保 contacts.json 文件存在
if (!fs.existsSync(contactsFilePath)) {
    fs.writeFileSync(contactsFilePath, '[]');
}

app.use(express.static(__dirname));
app.use(express.json());

// 获取联系人列表
app.get('/get-contacts', (req, res) => {
    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: '读取文件失败' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// 保存联系人
app.post('/save-contact', (req, res) => {
    const newContact = req.body;
    fs.readFile(contactsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: '读取文件失败' });
        } else {
            const contacts = JSON.parse(data);
            contacts.push(newContact);
            fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ success: false, message: '保存文件失败' });
                } else {
                    res.json({ success: true });
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});