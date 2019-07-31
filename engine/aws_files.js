const fs = require('fs');
const ini = require('ini');
const homedir = require('os').homedir();

class Ini {
    constructor(file_url) {
        this.file_url = file_url;
        this.load();
    }
    load() {
        try {
            const ini_contents = fs.readFileSync(this.file_url, 'utf8');
            this.contents = ini.parse(ini_contents);
        } catch (error) {
            throw new Error('Failed to load file ' + this.file_url)
        }
    }
    save() {
        const ini_contents = ini.stringify(this.contents);
        fs.writeFileSync(this.file_url, ini_contents);
    }
    switch(from, to) {
        this.update(to, this.getValue(from));
        this.save()
    }
    update(key, data) {
        if (!this.getKeys().includes(key)) {
            throw new Error('Invalid key value ' + key);
        }
        this.contents[key] = data;
    }
    getValue(key) {
        if (!this.getKeys().includes(key)) {
            throw new Error('Invalid key value ' + key);
        }
        return this.contents[key];
    }
    addKey(key, data) {
        this.contents[key] = data
    }
    getKeys() {
        return Object.keys(this.contents)
    }
    toObject() {
        return this.contents;
    }
}

class Credentials extends Ini {
    constructor(file_url = homedir + '/.aws/credentials') {
        super(file_url)
    }
}
class Configs extends Ini {
    constructor(file_url = homedir + '/.aws/config') {
        super(file_url)
    }
}
module.exports = {
    Configs,
    Credentials
};