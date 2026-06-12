//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
//#endregion
let electron = require("electron");
let node_path = require("node:path");
node_path = __toESM(node_path, 1);
let fs = require("fs");
fs = __toESM(fs, 1);
let path = require("path");
path = __toESM(path, 1);
let os = require("os");
os = __toESM(os, 1);
let child_process = require("child_process");
let http = require("http");
http = __toESM(http, 1);
let node_child_process = require("node:child_process");
let node_fs = require("node:fs");
node_fs = __toESM(node_fs, 1);
//#region node_modules/dotenv/package.json
var package_exports = /* @__PURE__ */ __exportAll({
	browser: () => browser,
	default: () => package_default,
	description: () => description,
	devDependencies: () => devDependencies,
	engines: () => engines,
	exports: () => exports$1,
	funding: () => funding,
	homepage: () => homepage,
	keywords: () => keywords,
	license: () => license,
	main: () => main,
	name: () => name,
	readmeFilename: () => readmeFilename,
	repository: () => repository,
	scripts: () => scripts,
	types: () => types,
	version: () => version
});
var name, version, description, main, types, exports$1, scripts, repository, homepage, funding, keywords, readmeFilename, license, devDependencies, engines, browser, package_default;
var init_package = __esmMin((() => {
	name = "dotenv";
	version = "16.6.1";
	description = "Loads environment variables from .env file";
	main = "lib/main.js";
	types = "lib/main.d.ts";
	exports$1 = {
		".": {
			"types": "./lib/main.d.ts",
			"require": "./lib/main.js",
			"default": "./lib/main.js"
		},
		"./config": "./config.js",
		"./config.js": "./config.js",
		"./lib/env-options": "./lib/env-options.js",
		"./lib/env-options.js": "./lib/env-options.js",
		"./lib/cli-options": "./lib/cli-options.js",
		"./lib/cli-options.js": "./lib/cli-options.js",
		"./package.json": "./package.json"
	};
	scripts = {
		"dts-check": "tsc --project tests/types/tsconfig.json",
		"lint": "standard",
		"pretest": "npm run lint && npm run dts-check",
		"test": "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
		"test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
		"prerelease": "npm test",
		"release": "standard-version"
	};
	repository = {
		"type": "git",
		"url": "git://github.com/motdotla/dotenv.git"
	};
	homepage = "https://github.com/motdotla/dotenv#readme";
	funding = "https://dotenvx.com";
	keywords = [
		"dotenv",
		"env",
		".env",
		"environment",
		"variables",
		"config",
		"settings"
	];
	readmeFilename = "README.md";
	license = "BSD-2-Clause";
	devDependencies = {
		"@types/node": "^18.11.3",
		"decache": "^4.6.2",
		"sinon": "^14.0.1",
		"standard": "^17.0.0",
		"standard-version": "^9.5.0",
		"tap": "^19.2.0",
		"typescript": "^4.8.4"
	};
	engines = { "node": ">=12" };
	browser = { "fs": false };
	package_default = {
		name,
		version,
		description,
		main,
		types,
		exports: exports$1,
		scripts,
		repository,
		homepage,
		funding,
		keywords,
		readmeFilename,
		license,
		devDependencies,
		engines,
		browser
	};
}));
//#endregion
//#region core/voice/textToSpeech.ts
var import_main = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$5 = require("fs");
	var path$7 = require("path");
	var os$2 = require("os");
	var crypto$1 = require("crypto");
	var version = (init_package(), __toCommonJS(package_exports).default).version;
	var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		options = options || {};
		const vaultPath = _vaultPath(options);
		options.path = vaultPath;
		const result = DotenvModule.configDotenv(options);
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.log(`[dotenv@${version}][WARN] ${message}`);
	}
	function _debug(message) {
		console.log(`[dotenv@${version}][DEBUG] ${message}`);
	}
	function _log(message) {
		console.log(`[dotenv@${version}] ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs$5.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path$7.resolve(process.cwd(), ".env.vault");
		if (fs$5.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path$7.join(os$2.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = Boolean(options && options.debug);
		const quiet = options && "quiet" in options ? options.quiet : true;
		if (debug || !quiet) _log("Loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path$7.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		const debug = Boolean(options && options.debug);
		const quiet = options && "quiet" in options ? options.quiet : true;
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("No encoding is specified. UTF-8 is used by default");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path$8 of optionPaths) try {
			const parsed = DotenvModule.parse(fs$5.readFileSync(path$8, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`Failed to load ${path$8} ${e.message}`);
			lastError = e;
		}
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsedAll, options);
		if (debug || !quiet) {
			const keysCount = Object.keys(parsedAll).length;
			const shortPaths = [];
			for (const filePath of optionPaths) try {
				const relative = path$7.relative(process.cwd(), filePath);
				shortPaths.push(relative);
			} catch (e) {
				if (debug) _debug(`Failed to load ${filePath} ${e.message}`);
				lastError = e;
			}
			_log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
		}
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto$1.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) processEnv[key] = parsed[key];
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else processEnv[key] = parsed[key];
	}
	var DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
})))(), 1);
import_main.default.config({ path: path.default.join(__dirname, "../../.env") });
var PANGKAL_PROJEK = path.default.resolve(__dirname, "../..");
var FOLDER_AUDIO_TEMP = path.default.join(PANGKAL_PROJEK, "data", "audio_temp");
if (!fs.default.existsSync(FOLDER_AUDIO_TEMP)) fs.default.mkdirSync(FOLDER_AUDIO_TEMP, { recursive: true });
/**
* 🌉 FUNGSI JAMBATAN (BRIDGE): Untuk selesaikan ralat Build dlm ai.ipc.ts dan openai.ts
* Fungsi ini akan jana suara dan terus mainkan ke speaker secara automatik!
*/
async function speakText(text) {
	console.log(`🔗 [TTS BRIDGE]: Menghubungkan fungsi speakText -> janaSuaraMatAi`);
	const pathAudioWav = await janaSuaraMatAi(text);
	if (pathAudioWav && fs.default.existsSync(pathAudioWav)) mainkanAudioLokal(pathAudioWav);
	return pathAudioWav;
}
/**
* 🔊 FUNGSI UTAMA: Menukarkan teks jawapan MAT.ai menjadi suara (.wav)
* mengikut pembekal (KOKORO lokal atau ELEVENLABS cloud) dlm .env
*/
async function janaSuaraMatAi(teks) {
	const provider = (process.env.TTS_PROVIDER || "KOKORO").toUpperCase();
	const namaFail = `tts_${Date.now()}.wav`;
	const pathFailOutput = path.default.join(FOLDER_AUDIO_TEMP, namaFail);
	console.log(`🔊 [CORE Node.js]: Menjana suara menggunakan enjin: ${provider}`);
	try {
		if (provider === "ELEVENLABS") {
			const apiKey = process.env.ELEVENLABS_API_KEY;
			const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
			if (!apiKey) {
				console.log("⚠️ [TTS WARN]: ELEVENLABS_API_KEY tak jumpa mat! Auto-fallback ke Kokoro Lokal.");
				return await janaSuaraGunaKokoroLokal(teks, pathFailOutput);
			}
			return await janaSuaraGunaElevenLabs(teks, pathFailOutput, apiKey, voiceId);
		} else return await janaSuaraGunaKokoroLokal(teks, pathFailOutput);
	} catch (err) {
		console.error(`❌ [TTS GLOBAL ERROR]: Gagal proses suara mat: ${err.message}`);
		return null;
	}
}
/**
* 🔵 SUB-ENJIN 1: Tembak ke Server FastAPI Kokoro Lokal (Port 8880)
*/
async function janaSuaraGunaKokoroLokal(teks, pathOutput) {
	const urlKokoro = "http://127.0.0.1:8880/v1/audio/speech";
	try {
		const response = await fetch(urlKokoro, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text: teks,
				voice: process.env.KOKORO_VOICE_NAME || "am_puck",
				speed: 1
			})
		});
		if (!response.ok) throw new Error(`Server Kokoro pulangkan status: ${response.status}`);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.default.writeFileSync(pathOutput, buffer);
		console.log(`✅ [TTS KOKORO]: Fail audio suci berjaya disimpan -> ${pathOutput}`);
		return pathOutput;
	} catch (error) {
		console.error(`❌ [TTS KOKORO ERROR]: Server lokal mati ke mat? Detail: ${error.message}`);
		return null;
	}
}
/**
* 🟣 SUB-ENJIN 2: Tembak ke ElevenLabs API Cloud (Jika bajet tebal)
*/
async function janaSuaraGunaElevenLabs(teks, pathOutput, apiKey, voiceId) {
	const urlEleven = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
	try {
		const response = await fetch(urlEleven, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"xi-api-key": apiKey
			},
			body: JSON.stringify({
				text: teks,
				model_id: "eleven_monolingual_v1",
				voice_settings: {
					stability: .5,
					similarity_boost: .75
				}
			})
		});
		if (!response.ok) throw new Error(`ElevenLabs pulangkan status: ${response.status}`);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		fs.default.writeFileSync(pathOutput, buffer);
		console.log(`🔥 [TTS ELEVENLABS]: Audio gred Hollywood disedut -> ${pathOutput}`);
		return pathOutput;
	} catch (error) {
		console.error(`❌ [TTS ELEVENLABS ERROR]: Gagal rembat data cloud: ${error.message}`);
		return null;
	}
}
/**
* 🎵 FUNGSI BONUS: Mainkan audio secara native ikut OS PC mat (Windows/Linux)
* Supaya Electron kau tak payah pening kepala load HTML5 Player
*/
function mainkanAudioLokal(pathAudio) {
	if (!fs.default.existsSync(pathAudio)) return;
	const platform = os.default.platform();
	let arahanCli = "";
	if (platform === "win32") arahanCli = `powershell -c "(New-Object Media.SoundPlayer '${pathAudio}').PlaySync()"`;
	else if (platform === "darwin") arahanCli = `afplay "${pathAudio}"`;
	else arahanCli = `aplay "${pathAudio}"`;
	(0, child_process.exec)(arahanCli, (err) => {
		if (err) console.error(`❌ [AUDIO PLAYER ERROR]: Gagal bunyikan speaker OS: ${err.message}`);
		try {
			fs.default.unlinkSync(pathAudio);
		} catch (e) {}
	});
}
//#endregion
//#region electron/kwsService.ts
function startLocalWakeupWord(mainWindow) {
	console.log("🐻 [LOKAL KWS]: Tugas mendengar dipindahkan ke Backend Python mat!");
}
//#endregion
//#region electron/window/createWindow.ts
var isDev = !electron.app.isPackaged && Boolean(process.env["VITE_DEV_SERVER_URL"]);
var preloadFile = node_path.default.join(__dirname, "preload.cjs");
function createWindow() {
	const win = new electron.BrowserWindow({
		width: 1100,
		height: 720,
		minWidth: 800,
		minHeight: 560,
		title: "MAT.ai",
		webPreferences: {
			preload: preloadFile,
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			spellcheck: false
		}
	});
	win.webContents.on("preload-error", (_event, preloadPath, error) => {
		console.error("[MAT.ai] Preload failed to load:", preloadPath, error);
	});
	if (isDev && process.env["VITE_DEV_SERVER_URL"]) {
		win.loadURL(process.env["VITE_DEV_SERVER_URL"]);
		if (process.env["MAT_AI_OPEN_DEVTOOLS"] === "1" || process.env["MAT_AI_OPEN_DEVTOOLS"] === "true") win.webContents.openDevTools({ mode: "detach" });
	} else win.loadFile(node_path.default.join(__dirname, "../dist/index.html"));
	return win;
}
//#endregion
//#region core/memory/shortTerm.ts
var ShortTermMemory = class {
	memoryLimit;
	sessions;
	constructor(limit = 20) {
		this.memoryLimit = limit;
		this.sessions = /* @__PURE__ */ new Map();
	}
	getHistory(sessionId) {
		if (!this.sessions.has(sessionId)) this.sessions.set(sessionId, []);
		return this.sessions.get(sessionId) || [];
	}
	addMessage(sessionId, role, content) {
		const history = this.getHistory(sessionId);
		history.push({
			role,
			content,
			timestamp: Date.now()
		});
		if (history.length > this.memoryLimit) {
			console.log(`🧹 [SHORT-TERM MEMORY]: Had token melebihi ${this.memoryLimit}. Membuang konteks lama.`);
			history.shift();
		}
		this.sessions.set(sessionId, history);
	}
	clearSession(sessionId) {
		this.sessions.set(sessionId, []);
		console.log(`🗑️ [SHORT-TERM MEMORY]: Sesi ${sessionId} telah dikosongkan.`);
	}
};
var shortTermMemory = new ShortTermMemory(20);
//#endregion
//#region core/models/local/localManager.ts
async function callOllamaStream(userText, systemInstruction, modelName, _event, attachment) {
	const sessionId = "default-user";
	try {
		const chatHistory = shortTermMemory.getHistory(sessionId);
		const historyTanpaMesejTerakhir = chatHistory.slice(0, -1);
		const mesejTerakhirAsal = chatHistory[chatHistory.length - 1];
		const formattedMessages = [{
			role: "system",
			content: systemInstruction
		}, ...historyTanpaMesejTerakhir.map((msg) => ({
			role: msg.role,
			content: msg.content
		}))];
		const userCurrentMessage = {
			role: "user",
			content: mesejTerakhirAsal ? mesejTerakhirAsal.content : userText
		};
		if (attachment && attachment.type === "image" && attachment.url) {
			console.log(`📸 [OLLAMA VISION ACTIVATED]: Menyumbat fail gambar ${attachment.name} ke dalam payload...`);
			userCurrentMessage.images = [attachment.url.split(",")[1] || attachment.url];
			if (!userCurrentMessage.content || !userCurrentMessage.content.trim()) userCurrentMessage.content = "Sila lihat dan terangkan gambar yang saya lampirkan ini, Boss.";
		}
		formattedMessages.push(userCurrentMessage);
		const response = await fetch("http://127.0.0.1:11434/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: modelName,
				messages: formattedMessages,
				stream: true,
				options: {
					temperature: .2,
					top_p: .5,
					num_predict: 256
				}
			})
		});
		if (!response.ok) throw new Error(`Ollama Error: ${response.statusText}`);
		const reader = response.body?.getReader();
		const decoder = new TextDecoder();
		let fullReply = "";
		if (!reader) return `Alamak BOSS, tiada data response dari model ${modelName}.`;
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const lines = decoder.decode(value, { stream: true }).split("\n");
			for (const line of lines) {
				if (!line.trim()) continue;
				try {
					const perkataan = JSON.parse(line).message?.content || "";
					if (perkataan) {
						fullReply += perkataan;
						_event.sender.send("mat-ai:stream-chunk", perkataan);
					}
				} catch (e) {}
			}
		}
		shortTermMemory.addMessage(sessionId, "assistant", fullReply);
		return fullReply;
	} catch (error) {
		console.error(`Gagal run model ${modelName}:`, error);
		const errText = `\n⚠️ [LOCAL MODEL ERROR]: Model *${modelName}* gagal bertindak balas. Pastikan Ollama app tengah run kat taskbar!`;
		_event.sender.send("mat-ai:stream-chunk", errText);
		return errText;
	}
}
//#endregion
//#region core/models/cloud/openai.ts
async function completeOpenAIFast(userText, systemInstruction, _event, attachment) {
	const messages = [{
		role: "system",
		content: systemInstruction
	}];
	if (attachment && attachment.type === "image") messages.push({
		role: "user",
		content: [{
			type: "text",
			text: userText || "Sila baca dan perhati gambar ini."
		}, {
			type: "image_url",
			image_url: { url: attachment.url }
		}]
	});
	else messages.push({
		role: "user",
		content: userText
	});
	let fullResponse = "";
	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${process.env["OPENAI_API_KEY"]}`
			},
			body: JSON.stringify({
				model: process.env["OPENAI_MODEL"]?.trim() || "gpt-4o-mini",
				messages,
				stream: true
			})
		});
		if (!response.ok) throw new Error(`OpenAI Error: ${response.statusText}`);
		const reader = response.body?.getReader();
		const decoder = new TextDecoder();
		if (!reader) return "";
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const lines = decoder.decode(value, { stream: true }).split("\n");
			for (const line of lines) {
				const bersih = line.trim();
				if (!bersih || bersih === "data: [DONE]") continue;
				if (bersih.startsWith("data: ")) try {
					const perkataan = JSON.parse(bersih.slice(6)).choices[0]?.delta?.content || "";
					if (perkataan) {
						fullResponse += perkataan;
						_event.sender.send("mat-ai:stream-chunk", perkataan);
					}
				} catch (e) {}
			}
		}
		if (fullResponse && fullResponse.length < 250) {
			const cleanSpeechText = fullResponse.replace(/\*\*|\*|_|#/g, "").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F200}-\u{1F2FF}]/gu, "");
			console.log(`🗣️ [OPENAI SUCCESS]: Menembak ayat penuh ke Kokoro -> "${cleanSpeechText}"`);
			speakText(cleanSpeechText);
		}
		return fullResponse;
	} catch (error) {
		console.error("Gagal panggil OpenAI Sembang:", error);
		return "Alamak BOSS, OpenAI Cloud sembang ada error.";
	}
}
//#endregion
//#region core/soul/responseStyle.ts
function getSystemPromptWithStyle(context) {
	try {
		const promptPath = path.join(process.cwd(), "core", "soul", "systemPrompt.txt");
		const basePrompt = fs.readFileSync(promptPath, "utf-8");
		let styleExtension = "\n\n[STYLE REINFORCEMENT]:\n";
		switch (context.intent) {
			case "SEMBANG":
				styleExtension += [
					"- MODE: CASUAL & STREET-SMART.",
					"- Tone: Sempoi, bersahaja, and witty.",
					"- Vocabulary: Use natural BM pasar (e.g., \"gila laju\", \"setel, Boss\", \"tak ada hal\").",
					"- Constraint: Keep responses very short, punchy, and fast. Do not write essays."
				].join("\n");
				break;
			case "KODING":
				styleExtension += [
					"- MODE: SENIOR SOFTWARE ENGINEER.",
					"- Tone: Direct, logical, and technically precise.",
					"- Code Standards: Provide clean, production-ready, modular code blocks. Use TypeScript/React best practices.",
					"- Vocabulary: Standard technical terms mixed with clean professional instructions."
				].join("\n");
				break;
			case "BERAT":
				styleExtension += [
					"- MODE: ADVANCED ANALYST AGENT.",
					"- Tone: Objective, deeply insightful, and comprehensive.",
					"- Execution: Break down complex operations step-by-step.",
					"- Focus on data accuracy, research insights, and logical flow."
				].join("\n");
				break;
			default: styleExtension += "- Maintain default street-smart assistant behaviour.";
		}
		return basePrompt + styleExtension;
	} catch (error) {
		console.error("⚠️ [SOUL]: Gagal membaca systemPrompt.txt, menggunakan fallback.", error);
		return "You are MAT.ai, a helpful desktop AI assistant. Reply in casual Malaysian Malay.";
	}
}
//#endregion
//#region core/router/router.ts
/**
* 🛠️ CONTEXT MANAGER: SISTEM CELIK MASA
* Supaya AI sentiasa tahu hari, tarikh, dan waktu sesi terkini di Malaysia.
*/
function dapatkanKonteksMasa() {
	const sekarang = /* @__PURE__ */ new Date();
	const masaString = sekarang.toLocaleDateString("ms-MY", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Asia/Kuala_Lumpur"
	});
	const jam = sekarang.getHours();
	let waktuSesi = "Malam";
	if (jam >= 5 && jam < 12) waktuSesi = "Pagi";
	else if (jam >= 12 && jam < 17) waktuSesi = "Tengah Hari / Petang";
	else if (jam >= 17 && jam < 19) waktuSesi = "Petang (Hampir Maghrib)";
	return `[CONTEXT MANAGER: Sekarang hari ${masaString}. Sesi: ${waktuSesi}. Lokasi: Malaysia.]`;
}
async function matAiRouter(userText, uiSelection, _event, localModelName = "llama3.1:8b", attachment) {
	const sessionId = "default-user";
	const memoryText = attachment ? `[User menghantar gambar: ${attachment.name}] ${userText}`.trim() : userText;
	shortTermMemory.addMessage(sessionId, "user", memoryText);
	let intent = "SEMBANG";
	let targetModelType = "local";
	if (uiSelection === "BRAIN") {
		intent = "BERAT";
		targetModelType = "cloud";
	} else if (uiSelection === "FAST_CLOUD") {
		intent = "SEMBANG";
		targetModelType = "cloud";
	} else {
		intent = "SEMBANG";
		targetModelType = "local";
	}
	const fullSystemInstruction = `
${getSystemPromptWithStyle({
		intent,
		targetModelType
	})}

---
CURRENT TIME & LOCATION CONTEXT:
${dapatkanKonteksMasa()}
  `.trim();
	console.log(`🚦 [MAT.AI ROUTER]: UI Selection = ${uiSelection} | Intent Style = ${intent} | Model = ${uiSelection === "FAST_LOCAL" ? localModelName : "Cloud"}`);
	let finalReply = "";
	switch (uiSelection) {
		case "BRAIN":
		case "FAST_CLOUD":
			console.log(`🧠 [MOD ${uiSelection}]: Menghubungi Backend Python (OpenAI + Mem0)...`);
			try {
				const response = await fetch("http://127.0.0.1:8880/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						text: userText,
						system_prompt: fullSystemInstruction,
						user_id: "tuan_farez"
					})
				});
				if (!response.ok) throw new Error(`Python API pulangkan status: ${response.status}`);
				finalReply = (await response.json()).text;
			} catch (err) {
				console.error("❌ [ROUTER CLOUD ERROR]: Backend Python mati ke mat? Fallback ke fungsi lokal.", err);
				finalReply = await completeOpenAIFast(userText, fullSystemInstruction, _event, attachment);
			}
			break;
		case "FAST_LOCAL":
			console.log(`⚡ [MOD FAST LOCAL]: Sembang offline via Ollama (${localModelName})...`);
			finalReply = await callOllamaStream(userText, fullSystemInstruction, localModelName, _event, attachment);
			break;
	}
	shortTermMemory.addMessage(sessionId, "assistant", finalReply);
	return finalReply;
}
//#endregion
//#region core/voice/speechToText.ts
import_main.default.config({ path: path.default.join(process.cwd(), ".env") });
/**
* 🎙️ [STT CORE]: Menukarkan buffer audio mentah dari frontend menjadi teks 
* menggunakan OpenAI Whisper API (Lock Language: 'ms')
*/
async function transcribeAudioBuffer(audioBuffer) {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) throw new Error("⚠️ [STT ERROR]: OPENAI_API_KEY tidak dijumpai dalam fail .env mat!");
	const tempFolder = path.default.join(process.cwd(), "data", "audio_temp");
	if (!fs.default.existsSync(tempFolder)) fs.default.mkdirSync(tempFolder, { recursive: true });
	const tempFilePath = path.default.join(tempFolder, `stt_${Date.now()}.wav`);
	fs.default.writeFileSync(tempFilePath, audioBuffer);
	console.log(`🎙️ [STT ENGINE]: Menembak fail audio ke Whisper API -> ${tempFilePath}`);
	try {
		const formData = new FormData();
		const fileBuffer = fs.default.readFileSync(tempFilePath);
		const audioBlob = new Blob([fileBuffer], { type: "audio/wav" });
		formData.append("file", audioBlob, "openai_whisper.wav");
		formData.append("model", "whisper-1");
		formData.append("language", "ms");
		const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
			method: "POST",
			headers: { "Authorization": `Bearer ${apiKey}` },
			body: formData
		});
		if (!response.ok) {
			const errText = await response.text();
			throw new Error(`OpenAI Whisper Error: ${response.status} - ${errText}`);
		}
		const hasilTeks = (await response.json()).text || "";
		console.log(`🎯 [STT SUCCESS]: Whisper dengar Boss cakap -> "${hasilTeks}"`);
		return hasilTeks;
	} catch (error) {
		console.error(`❌ [STT MASTER ERROR]: Gagal transkripsi suara: ${error.message}`);
		throw error;
	} finally {
		try {
			if (fs.default.existsSync(tempFilePath)) fs.default.unlinkSync(tempFilePath);
		} catch (e) {}
	}
}
//#endregion
//#region node_modules/@seald-io/nedb/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Utility functions for all environments.
	* This replaces the underscore dependency.
	*
	* @module utils
	* @private
	*/
	/**
	* @callback IterateeFunction
	* @param {*} arg
	* @return {*}
	*/
	/**
	* Produces a duplicate-free version of the array, using === to test object equality. In particular only the first
	* occurrence of each value is kept. If you want to compute unique items based on a transformation, pass an iteratee
	* function.
	*
	* Heavily inspired by {@link https://underscorejs.org/#uniq}.
	* @param {Array} array
	* @param {IterateeFunction} [iteratee] transformation applied to every element before checking for duplicates. This will not
	* transform the items in the result.
	* @return {Array}
	* @alias module:utils.uniq
	*/
	var uniq = (array, iteratee) => {
		if (iteratee) return [...new Map(array.map((x) => [iteratee(x), x])).values()];
		else return [...new Set(array)];
	};
	/**
	* Returns true if arg is an Object. Note that JavaScript arrays and functions are objects, while (normal) strings
	* and numbers are not.
	*
	* Heavily inspired by {@link https://underscorejs.org/#isObject}.
	* @param {*} arg
	* @return {boolean}
	*/
	var isObject = (arg) => typeof arg === "object" && arg !== null;
	/**
	* Returns true if d is a Date.
	*
	* Heavily inspired by {@link https://underscorejs.org/#isDate}.
	* @param {*} d
	* @return {boolean}
	* @alias module:utils.isDate
	*/
	var isDate = (d) => isObject(d) && Object.prototype.toString.call(d) === "[object Date]";
	/**
	* Returns true if re is a RegExp.
	*
	* Heavily inspired by {@link https://underscorejs.org/#isRegExp}.
	* @param {*} re
	* @return {boolean}
	* @alias module:utils.isRegExp
	*/
	var isRegExp = (re) => isObject(re) && Object.prototype.toString.call(re) === "[object RegExp]";
	/**
	* Return a copy of the object filtered using the given keys.
	*
	* @param {object} object
	* @param {string[]} keys
	* @return {object}
	*/
	var pick = (object, keys) => {
		return keys.reduce((obj, key) => {
			if (object && Object.prototype.hasOwnProperty.call(object, key)) obj[key] = object[key];
			return obj;
		}, {});
	};
	var filterIndexNames = (indexNames) => ([k, v]) => !!(typeof v === "string" || typeof v === "number" || typeof v === "boolean" || isDate(v) || v === null) && indexNames.includes(k);
	module.exports.uniq = uniq;
	module.exports.isDate = isDate;
	module.exports.isRegExp = isRegExp;
	module.exports.pick = pick;
	module.exports.filterIndexNames = filterIndexNames;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/model.js
var require_model = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Handle models (i.e. docs)
	* Serialization/deserialization
	* Copying
	* Querying, update
	* @module model
	* @private
	*/
	var { uniq, isDate, isRegExp } = require_utils();
	/**
	* Check a key, throw an error if the key is non valid
	* @param {string} k key
	* @param {document} v value, needed to treat the Date edge case
	* Non-treatable edge cases here: if part of the object if of the form { $$date: number } or { $$deleted: true }
	* Its serialized-then-deserialized version it will transformed into a Date object
	* But you really need to want it to trigger such behaviour, even when warned not to use '$' at the beginning of the field names...
	* @private
	*/
	var checkKey = (k, v) => {
		if (typeof k === "number") k = k.toString();
		if (k[0] === "$" && !(k === "$$date" && typeof v === "number") && !(k === "$$deleted" && v === true) && !(k === "$$indexCreated") && !(k === "$$indexRemoved")) throw new Error("Field names cannot begin with the $ character");
		if (k.indexOf(".") !== -1) throw new Error("Field names cannot contain a .");
	};
	/**
	* Check a DB object and throw an error if it's not valid
	* Works by applying the above checkKey function to all fields recursively
	* @param {document|document[]} obj
	* @alias module:model.checkObject
	*/
	var checkObject = (obj) => {
		if (Array.isArray(obj)) obj.forEach((o) => {
			checkObject(o);
		});
		if (typeof obj === "object" && obj !== null) {
			for (const k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
				checkKey(k, obj[k]);
				checkObject(obj[k]);
			}
		}
	};
	/**
	* Serialize an object to be persisted to a one-line string
	* For serialization/deserialization, we use the native JSON parser and not eval or Function
	* That gives us less freedom but data entered in the database may come from users
	* so eval and the like are not safe
	* Accepted primitive types: Number, String, Boolean, Date, null
	* Accepted secondary types: Objects, Arrays
	* @param {document} obj
	* @return {string}
	* @alias module:model.serialize
	*/
	var serialize = (obj) => {
		return JSON.stringify(obj, function(k, v) {
			checkKey(k, v);
			if (v === void 0) return void 0;
			if (v === null) return null;
			if (typeof this[k].getTime === "function") return { $$date: this[k].getTime() };
			return v;
		});
	};
	/**
	* From a one-line representation of an object generate by the serialize function
	* Return the object itself
	* @param {string} rawData
	* @return {document}
	* @alias module:model.deserialize
	*/
	var deserialize = (rawData) => JSON.parse(rawData, function(k, v) {
		if (k === "$$date") return new Date(v);
		if (typeof v === "string" || typeof v === "number" || typeof v === "boolean" || v === null) return v;
		if (v && v.$$date) return v.$$date;
		return v;
	});
	/**
	* Deep copy a DB object
	* The optional strictKeys flag (defaulting to false) indicates whether to copy everything or only fields
	* where the keys are valid, i.e. don't begin with $ and don't contain a .
	* @param {?document} obj
	* @param {boolean} [strictKeys=false]
	* @return {?document}
	* @alias module:modelel:(.*)
	*/
	function deepCopy(obj, strictKeys) {
		if (typeof obj === "boolean" || typeof obj === "number" || typeof obj === "string" || obj === null || isDate(obj)) return obj;
		if (Array.isArray(obj)) return obj.map((o) => deepCopy(o, strictKeys));
		if (typeof obj === "object") {
			const res = {};
			for (const k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && (!strictKeys || k[0] !== "$" && k.indexOf(".") === -1)) res[k] = deepCopy(obj[k], strictKeys);
			return res;
		}
	}
	/**
	* Tells if an object is a primitive type or a "real" object
	* Arrays are considered primitive
	* @param {*} obj
	* @return {boolean}
	* @alias module:modelel:(.*)
	*/
	var isPrimitiveType = (obj) => typeof obj === "boolean" || typeof obj === "number" || typeof obj === "string" || obj === null || isDate(obj) || Array.isArray(obj);
	/**
	* Utility functions for comparing things
	* Assumes type checking was already done (a and b already have the same type)
	* compareNSB works for numbers, strings and booleans
	* @param {number|string|boolean} a
	* @param {number|string|boolean} b
	* @return {number} 0 if a == b, 1 i a > b, -1 if a < b
	* @private
	*/
	var compareNSB = (a, b) => {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	};
	/**
	* Utility function for comparing array
	* Assumes type checking was already done (a and b already have the same type)
	* compareNSB works for numbers, strings and booleans
	* @param {Array} a
	* @param {Array} b
	* @return {number} 0 if arrays have the same length and all elements equal one another. Else either 1 or -1.
	* @private
	*/
	var compareArrays = (a, b) => {
		const minLength = Math.min(a.length, b.length);
		for (let i = 0; i < minLength; i += 1) {
			const comp = compareThings(a[i], b[i]);
			if (comp !== 0) return comp;
		}
		return compareNSB(a.length, b.length);
	};
	/**
	* Compare { things U undefined }
	* Things are defined as any native types (string, number, boolean, null, date) and objects
	* We need to compare with undefined as it will be used in indexes
	* In the case of objects and arrays, we deep-compare
	* If two objects dont have the same type, the (arbitrary) type hierarchy is: undefined, null, number, strings, boolean, dates, arrays, objects
	* Return -1 if a < b, 1 if a > b and 0 if a = b (note that equality here is NOT the same as defined in areThingsEqual!)
	* @param {*} a
	* @param {*} b
	* @param {compareStrings} [_compareStrings] String comparing function, returning -1, 0 or 1, overriding default string comparison (useful for languages with accented letters)
	* @return {number}
	* @alias module:model.compareThings
	*/
	var compareThings = (a, b, _compareStrings) => {
		const compareStrings = _compareStrings || compareNSB;
		if (a === void 0) return b === void 0 ? 0 : -1;
		if (b === void 0) return 1;
		if (a === null) return b === null ? 0 : -1;
		if (b === null) return 1;
		if (typeof a === "number") return typeof b === "number" ? compareNSB(a, b) : -1;
		if (typeof b === "number") return typeof a === "number" ? compareNSB(a, b) : 1;
		if (typeof a === "string") return typeof b === "string" ? compareStrings(a, b) : -1;
		if (typeof b === "string") return typeof a === "string" ? compareStrings(a, b) : 1;
		if (typeof a === "boolean") return typeof b === "boolean" ? compareNSB(a, b) : -1;
		if (typeof b === "boolean") return typeof a === "boolean" ? compareNSB(a, b) : 1;
		if (isDate(a)) return isDate(b) ? compareNSB(a.getTime(), b.getTime()) : -1;
		if (isDate(b)) return isDate(a) ? compareNSB(a.getTime(), b.getTime()) : 1;
		if (Array.isArray(a)) return Array.isArray(b) ? compareArrays(a, b) : -1;
		if (Array.isArray(b)) return Array.isArray(a) ? compareArrays(a, b) : 1;
		const aKeys = Object.keys(a).sort();
		const bKeys = Object.keys(b).sort();
		for (let i = 0; i < Math.min(aKeys.length, bKeys.length); i += 1) {
			const comp = compareThings(a[aKeys[i]], b[bKeys[i]]);
			if (comp !== 0) return comp;
		}
		return compareNSB(aKeys.length, bKeys.length);
	};
	/**
	* @callback modifierFunction
	* The signature of modifier functions is as follows
	* Their structure is always the same: recursively follow the dot notation while creating
	* the nested documents if needed, then apply the "last step modifier"
	* @param {Object} obj The model to modify
	* @param {String} field Can contain dots, in that case that means we will set a subfield recursively
	* @param {document} value
	*/
	/**
	* Create the complete modifier function
	* @param {modifierFunction} lastStepModifierFunction a lastStepModifierFunction
	* @param {boolean} [unset = false] Bad looking specific fix, needs to be generalized modifiers that behave like $unset are implemented
	* @return {modifierFunction}
	* @private
	*/
	var createModifierFunction = (lastStepModifierFunction, unset = false) => {
		const func = (obj, field, value) => {
			const fieldParts = typeof field === "string" ? field.split(".") : field;
			if (fieldParts.length === 1) lastStepModifierFunction(obj, field, value);
			else {
				if (obj[fieldParts[0]] === void 0) {
					if (unset) return;
					obj[fieldParts[0]] = {};
				}
				func(obj[fieldParts[0]], fieldParts.slice(1), value);
			}
		};
		return func;
	};
	var $addToSetPartial = (obj, field, value) => {
		if (!Object.prototype.hasOwnProperty.call(obj, field)) obj[field] = [];
		if (!Array.isArray(obj[field])) throw new Error("Can't $addToSet an element on non-array values");
		if (value !== null && typeof value === "object" && value.$each) {
			if (Object.keys(value).length > 1) throw new Error("Can't use another field in conjunction with $each");
			if (!Array.isArray(value.$each)) throw new Error("$each requires an array value");
			value.$each.forEach((v) => {
				$addToSetPartial(obj, field, v);
			});
		} else {
			let addToSet = true;
			obj[field].forEach((v) => {
				if (compareThings(v, value) === 0) addToSet = false;
			});
			if (addToSet) obj[field].push(value);
		}
	};
	/**
	* @enum {modifierFunction}
	*/
	var modifierFunctions = {
		/**
		* Set a field to a new value
		*/
		$set: createModifierFunction((obj, field, value) => {
			obj[field] = value;
		}),
		/**
		* Unset a field
		*/
		$unset: createModifierFunction((obj, field, value) => {
			delete obj[field];
		}, true),
		/**
		* Updates the value of the field, only if specified field is smaller than the current value of the field
		*/
		$min: createModifierFunction((obj, field, value) => {
			if (typeof obj[field] === "undefined") obj[field] = value;
			else if (value < obj[field]) obj[field] = value;
		}),
		/**
		* Updates the value of the field, only if specified field is greater than the current value of the field
		*/
		$max: createModifierFunction((obj, field, value) => {
			if (typeof obj[field] === "undefined") obj[field] = value;
			else if (value > obj[field]) obj[field] = value;
		}),
		/**
		* Increment a numeric field's value
		*/
		$inc: createModifierFunction((obj, field, value) => {
			if (typeof value !== "number") throw new Error(`${value} must be a number`);
			if (typeof obj[field] !== "number") if (!Object.prototype.hasOwnProperty.call(obj, field)) obj[field] = value;
			else throw new Error("Don't use the $inc modifier on non-number fields");
			else obj[field] += value;
		}),
		/**
		* Removes all instances of a value from an existing array
		*/
		$pull: createModifierFunction((obj, field, value) => {
			if (!Array.isArray(obj[field])) throw new Error("Can't $pull an element from non-array values");
			const arr = obj[field];
			for (let i = arr.length - 1; i >= 0; i -= 1) if (match(arr[i], value)) arr.splice(i, 1);
		}),
		/**
		* Remove the first or last element of an array
		*/
		$pop: createModifierFunction((obj, field, value) => {
			if (!Array.isArray(obj[field])) throw new Error("Can't $pop an element from non-array values");
			if (typeof value !== "number") throw new Error(`${value} isn't an integer, can't use it with $pop`);
			if (value === 0) return;
			if (value > 0) obj[field] = obj[field].slice(0, obj[field].length - 1);
			else obj[field] = obj[field].slice(1);
		}),
		/**
		* Add an element to an array field only if it is not already in it
		* No modification if the element is already in the array
		* Note that it doesn't check whether the original array contains duplicates
		*/
		$addToSet: createModifierFunction($addToSetPartial),
		/**
		* Push an element to the end of an array field
		* Optional modifier $each instead of value to push several values
		* Optional modifier $slice to slice the resulting array, see https://docs.mongodb.org/manual/reference/operator/update/slice/
		* Difference with MongoDB: if $slice is specified and not $each, we act as if value is an empty array
		*/
		$push: createModifierFunction((obj, field, value) => {
			if (!Object.prototype.hasOwnProperty.call(obj, field)) obj[field] = [];
			if (!Array.isArray(obj[field])) throw new Error("Can't $push an element on non-array values");
			if (value !== null && typeof value === "object" && value.$slice && value.$each === void 0) value.$each = [];
			if (value !== null && typeof value === "object" && value.$each) {
				if (Object.keys(value).length >= 3 || Object.keys(value).length === 2 && value.$slice === void 0) throw new Error("Can only use $slice in cunjunction with $each when $push to array");
				if (!Array.isArray(value.$each)) throw new Error("$each requires an array value");
				value.$each.forEach((v) => {
					obj[field].push(v);
				});
				if (value.$slice === void 0 || typeof value.$slice !== "number") return;
				if (value.$slice === 0) obj[field] = [];
				else {
					let start;
					let end;
					const n = obj[field].length;
					if (value.$slice < 0) {
						start = Math.max(0, n + value.$slice);
						end = n;
					} else if (value.$slice > 0) {
						start = 0;
						end = Math.min(n, value.$slice);
					}
					obj[field] = obj[field].slice(start, end);
				}
			} else obj[field].push(value);
		})
	};
	/**
	* Modify a DB object according to an update query
	* @param {document} obj
	* @param {query} updateQuery
	* @return {document}
	* @alias module:model.modify
	*/
	var modify = (obj, updateQuery) => {
		const keys = Object.keys(updateQuery);
		const firstChars = keys.map((item) => item[0]);
		const dollarFirstChars = firstChars.filter((c) => c === "$");
		let newDoc;
		let modifiers;
		if (keys.indexOf("_id") !== -1 && updateQuery._id !== obj._id) throw new Error("You cannot change a document's _id");
		if (dollarFirstChars.length !== 0 && dollarFirstChars.length !== firstChars.length) throw new Error("You cannot mix modifiers and normal fields");
		if (dollarFirstChars.length === 0) {
			newDoc = deepCopy(updateQuery);
			newDoc._id = obj._id;
		} else {
			modifiers = uniq(keys);
			newDoc = deepCopy(obj);
			modifiers.forEach((m) => {
				if (!modifierFunctions[m]) throw new Error(`Unknown modifier ${m}`);
				if (typeof updateQuery[m] !== "object") throw new Error(`Modifier ${m}'s argument must be an object`);
				Object.keys(updateQuery[m]).forEach((k) => {
					modifierFunctions[m](newDoc, k, updateQuery[m][k]);
				});
			});
		}
		checkObject(newDoc);
		if (obj._id !== newDoc._id) throw new Error("You can't change a document's _id");
		return newDoc;
	};
	/**
	* Get a value from object with dot notation
	* @param {object} obj
	* @param {string} field
	* @return {*}
	* @alias module:model.getDotValue
	*/
	var getDotValue = (obj, field) => {
		const fieldParts = typeof field === "string" ? field.split(".") : field;
		if (!obj) return void 0;
		if (fieldParts.length === 0) return obj;
		if (fieldParts.length === 1) return obj[fieldParts[0]];
		if (Array.isArray(obj[fieldParts[0]])) {
			const i = parseInt(fieldParts[1], 10);
			if (typeof i === "number" && !isNaN(i)) return getDotValue(obj[fieldParts[0]][i], fieldParts.slice(2));
			return obj[fieldParts[0]].map((el) => getDotValue(el, fieldParts.slice(1)));
		} else return getDotValue(obj[fieldParts[0]], fieldParts.slice(1));
	};
	/**
	* Get dot values for either a bunch of fields or just one.
	*/
	var getDotValues = (obj, fields) => {
		if (!Array.isArray(fields)) throw new Error("fields must be an Array");
		if (fields.length > 1) {
			const key = {};
			for (const field of fields) key[field] = getDotValue(obj, field);
			return key;
		} else return getDotValue(obj, fields[0]);
	};
	/**
	* Check whether 'things' are equal
	* Things are defined as any native types (string, number, boolean, null, date) and objects
	* In the case of object, we check deep equality
	* Returns true if they are, false otherwise
	* @param {*} a
	* @param {*} a
	* @return {boolean}
	* @alias module:model.areThingsEqual
	*/
	var areThingsEqual = (a, b) => {
		if (a === null || typeof a === "string" || typeof a === "boolean" || typeof a === "number" || b === null || typeof b === "string" || typeof b === "boolean" || typeof b === "number") return a === b;
		if (isDate(a) || isDate(b)) return isDate(a) && isDate(b) && a.getTime() === b.getTime();
		if (!(Array.isArray(a) && Array.isArray(b)) && (Array.isArray(a) || Array.isArray(b)) || a === void 0 || b === void 0) return false;
		let aKeys;
		let bKeys;
		try {
			aKeys = Object.keys(a);
			bKeys = Object.keys(b);
		} catch (e) {
			return false;
		}
		if (aKeys.length !== bKeys.length) return false;
		for (const el of aKeys) {
			if (bKeys.indexOf(el) === -1) return false;
			if (!areThingsEqual(a[el], b[el])) return false;
		}
		return true;
	};
	/**
	* Check that two values are comparable
	* @param {*} a
	* @param {*} a
	* @return {boolean}
	* @private
	*/
	var areComparable = (a, b) => {
		if (typeof a !== "string" && typeof a !== "number" && !isDate(a) && typeof b !== "string" && typeof b !== "number" && !isDate(b)) return false;
		if (typeof a !== typeof b) return false;
		return true;
	};
	/**
	* @callback comparisonOperator
	* Arithmetic and comparison operators
	* @param {*} a Value in the object
	* @param {*} b Value in the query
	* @return {boolean}
	*/
	/**
	* @enum {comparisonOperator}
	*/
	var comparisonFunctions = {
		/** Lower than */
		$lt: (a, b) => areComparable(a, b) && a < b,
		/** Lower than or equals */
		$lte: (a, b) => areComparable(a, b) && a <= b,
		/** Greater than */
		$gt: (a, b) => areComparable(a, b) && a > b,
		/** Greater than or equals */
		$gte: (a, b) => areComparable(a, b) && a >= b,
		/** Does not equal */
		$ne: (a, b) => a === void 0 || !areThingsEqual(a, b),
		/** Is in Array */
		$in: (a, b) => {
			if (!Array.isArray(b)) throw new Error("$in operator called with a non-array");
			for (const el of b) if (areThingsEqual(a, el)) return true;
			return false;
		},
		/** Is not in Array */
		$nin: (a, b) => {
			if (!Array.isArray(b)) throw new Error("$nin operator called with a non-array");
			return !comparisonFunctions.$in(a, b);
		},
		/** Matches Regexp */
		$regex: (a, b) => {
			if (!isRegExp(b)) throw new Error("$regex operator called with non regular expression");
			if (typeof a !== "string") return false;
			else return b.test(a);
		},
		/** Returns true if field exists */
		$exists: (a, b) => {
			if (b || b === "") b = true;
			else b = false;
			if (a === void 0) return !b;
			else return b;
		},
		/** Specific to Arrays, returns true if a length equals b */
		$size: (a, b) => {
			if (!Array.isArray(a)) return false;
			if (b % 1 !== 0) throw new Error("$size operator called without an integer");
			return a.length === b;
		},
		/** Specific to Arrays, returns true if some elements of a match the query b */
		$elemMatch: (a, b) => {
			if (!Array.isArray(a)) return false;
			return a.some((el) => match(el, b));
		}
	};
	var arrayComparisonFunctions = {
		$size: true,
		$elemMatch: true
	};
	/**
	* @enum
	*/
	var logicalOperators = {
		/**
		* Match any of the subqueries
		* @param {document} obj
		* @param {query[]} query
		* @return {boolean}
		*/
		$or: (obj, query) => {
			if (!Array.isArray(query)) throw new Error("$or operator used without an array");
			for (let i = 0; i < query.length; i += 1) if (match(obj, query[i])) return true;
			return false;
		},
		/**
		* Match all of the subqueries
		* @param {document} obj
		* @param {query[]} query
		* @return {boolean}
		*/
		$and: (obj, query) => {
			if (!Array.isArray(query)) throw new Error("$and operator used without an array");
			for (let i = 0; i < query.length; i += 1) if (!match(obj, query[i])) return false;
			return true;
		},
		/**
		* Inverted match of the query
		* @param {document} obj
		* @param {query} query
		* @return {boolean}
		*/
		$not: (obj, query) => !match(obj, query),
		/**
		* @callback whereCallback
		* @param {document} obj
		* @return {boolean}
		*/
		/**
		* Use a function to match
		* @param {document} obj
		* @param {whereCallback} fn
		* @return {boolean}
		*/
		$where: (obj, fn) => {
			if (typeof fn !== "function") throw new Error("$where operator used without a function");
			const result = fn.call(obj);
			if (typeof result !== "boolean") throw new Error("$where function must return boolean");
			return result;
		}
	};
	/**
	* Tell if a given document matches a query
	* @param {document} obj Document to check
	* @param {query} query
	* @return {boolean}
	* @alias module:model.match
	*/
	var match = (obj, query) => {
		if (isPrimitiveType(obj) || isPrimitiveType(query)) return matchQueryPart({ needAKey: obj }, "needAKey", query);
		for (const queryKey in query) if (Object.prototype.hasOwnProperty.call(query, queryKey)) {
			const queryValue = query[queryKey];
			if (queryKey[0] === "$") {
				if (!logicalOperators[queryKey]) throw new Error(`Unknown logical operator ${queryKey}`);
				if (!logicalOperators[queryKey](obj, queryValue)) return false;
			} else if (!matchQueryPart(obj, queryKey, queryValue)) return false;
		}
		return true;
	};
	/**
	* Match an object against a specific { key: value } part of a query
	* if the treatObjAsValue flag is set, don't try to match every part separately, but the array as a whole
	* @param {object} obj
	* @param {string} queryKey
	* @param {*} queryValue
	* @param {boolean} [treatObjAsValue=false]
	* @return {boolean}
	* @private
	*/
	function matchQueryPart(obj, queryKey, queryValue, treatObjAsValue) {
		const objValue = getDotValue(obj, queryKey);
		if (Array.isArray(objValue) && !treatObjAsValue) {
			if (Array.isArray(queryValue)) return matchQueryPart(obj, queryKey, queryValue, true);
			if (queryValue !== null && typeof queryValue === "object" && !isRegExp(queryValue)) {
				for (const key in queryValue) if (Object.prototype.hasOwnProperty.call(queryValue, key) && arrayComparisonFunctions[key]) return matchQueryPart(obj, queryKey, queryValue, true);
			}
			for (const el of objValue) if (matchQueryPart({ k: el }, "k", queryValue)) return true;
			return false;
		}
		if (queryValue !== null && typeof queryValue === "object" && !isRegExp(queryValue) && !Array.isArray(queryValue)) {
			const keys = Object.keys(queryValue);
			const firstChars = keys.map((item) => item[0]);
			const dollarFirstChars = firstChars.filter((c) => c === "$");
			if (dollarFirstChars.length !== 0 && dollarFirstChars.length !== firstChars.length) throw new Error("You cannot mix operators and normal fields");
			if (dollarFirstChars.length > 0) {
				for (const key of keys) {
					if (!comparisonFunctions[key]) throw new Error(`Unknown comparison function ${key}`);
					if (!comparisonFunctions[key](objValue, queryValue[key])) return false;
				}
				return true;
			}
		}
		if (isRegExp(queryValue)) return comparisonFunctions.$regex(objValue, queryValue);
		return areThingsEqual(objValue, queryValue);
	}
	module.exports.serialize = serialize;
	module.exports.deserialize = deserialize;
	module.exports.deepCopy = deepCopy;
	module.exports.checkObject = checkObject;
	module.exports.isPrimitiveType = isPrimitiveType;
	module.exports.modify = modify;
	module.exports.getDotValue = getDotValue;
	module.exports.getDotValues = getDotValues;
	module.exports.match = match;
	module.exports.areThingsEqual = areThingsEqual;
	module.exports.compareThings = compareThings;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/cursor.js
var require_cursor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var model = require_model();
	var { callbackify: callbackify$1 } = require("util");
	/**
	* Has a callback
	* @callback Cursor~mapFn
	* @param {document[]} res
	* @return {*|Promise<*>}
	*/
	/**
	* Manage access to data, be it to find, update or remove it.
	*
	* It extends `Promise` so that its methods (which return `this`) are chainable & awaitable.
	* @extends Promise
	*/
	var Cursor = class {
		/**
		* Create a new cursor for this collection.
		* @param {Datastore} db - The datastore this cursor is bound to
		* @param {query} query - The query this cursor will operate on
		* @param {Cursor~mapFn} [mapFn] - Handler to be executed after cursor has found the results and before the callback passed to find/findOne/update/remove
		*/
		constructor(db, query, mapFn) {
			/**
			* @protected
			* @type {Datastore}
			*/
			this.db = db;
			/**
			* @protected
			* @type {query}
			*/
			this.query = query || {};
			/**
			* The handler to be executed after cursor has found the results.
			* @type {Cursor~mapFn}
			* @protected
			*/
			if (mapFn) this.mapFn = mapFn;
			/**
			* @see Cursor#limit
			* @type {undefined|number}
			* @private
			*/
			this._limit = void 0;
			/**
			* @see Cursor#skip
			* @type {undefined|number}
			* @private
			*/
			this._skip = void 0;
			/**
			* @see Cursor#sort
			* @type {undefined|Object.<string, number>}
			* @private
			*/
			this._sort = void 0;
			/**
			* @see Cursor#projection
			* @type {undefined|Object.<string, number>}
			* @private
			*/
			this._projection = void 0;
		}
		/**
		* Set a limit to the number of results for the given Cursor.
		* @param {Number} limit
		* @return {Cursor} the same instance of Cursor, (useful for chaining).
		*/
		limit(limit) {
			this._limit = limit;
			return this;
		}
		/**
		* Skip a number of results for the given Cursor.
		* @param {Number} skip
		* @return {Cursor} the same instance of Cursor, (useful for chaining).
		*/
		skip(skip) {
			this._skip = skip;
			return this;
		}
		/**
		* Sort results of the query for the given Cursor.
		* @param {Object.<string, number>} sortQuery - sortQuery is { field: order }, field can use the dot-notation, order is 1 for ascending and -1 for descending
		* @return {Cursor} the same instance of Cursor, (useful for chaining).
		*/
		sort(sortQuery) {
			this._sort = sortQuery;
			return this;
		}
		/**
		* Add the use of a projection to the given Cursor.
		* @param {Object.<string, number>} projection - MongoDB-style projection. {} means take all fields. Then it's { key1: 1, key2: 1 } to take only key1 and key2
		* { key1: 0, key2: 0 } to omit only key1 and key2. Except _id, you can't mix takes and omits.
		* @return {Cursor} the same instance of Cursor, (useful for chaining).
		*/
		projection(projection) {
			this._projection = projection;
			return this;
		}
		/**
		* Apply the projection.
		*
		* This is an internal function. You should use {@link Cursor#execAsync} or {@link Cursor#exec}.
		* @param {document[]} candidates
		* @return {document[]}
		* @private
		*/
		_project(candidates) {
			const res = [];
			let action;
			if (this._projection === void 0 || Object.keys(this._projection).length === 0) return candidates;
			const keepId = this._projection._id !== 0;
			const { _id, ...rest } = this._projection;
			this._projection = rest;
			const keys = Object.keys(this._projection);
			keys.forEach((k) => {
				if (action !== void 0 && this._projection[k] !== action) throw new Error("Can't both keep and omit fields except for _id");
				action = this._projection[k];
			});
			candidates.forEach((candidate) => {
				let toPush;
				if (action === 1) {
					toPush = { $set: {} };
					keys.forEach((k) => {
						toPush.$set[k] = model.getDotValue(candidate, k);
						if (toPush.$set[k] === void 0) delete toPush.$set[k];
					});
					toPush = model.modify({}, toPush);
				} else {
					toPush = { $unset: {} };
					keys.forEach((k) => {
						toPush.$unset[k] = true;
					});
					toPush = model.modify(candidate, toPush);
				}
				if (keepId) toPush._id = candidate._id;
				else delete toPush._id;
				res.push(toPush);
			});
			return res;
		}
		/**
		* Get all matching elements
		* Will return pointers to matched elements (shallow copies), returning full copies is the role of find or findOne
		* This is an internal function, use execAsync which uses the executor
		* @return {document[]|Promise<*>}
		* @private
		*/
		async _execAsync() {
			let res = [];
			let added = 0;
			let skipped = 0;
			const candidates = await this.db._getCandidatesAsync(this.query);
			for (const candidate of candidates) if (model.match(candidate, this.query)) if (!this._sort) if (this._skip && this._skip > skipped) skipped += 1;
			else {
				res.push(candidate);
				added += 1;
				if (this._limit && this._limit <= added) break;
			}
			else res.push(candidate);
			if (this._sort) {
				const criteria = Object.entries(this._sort).map(([key, direction]) => ({
					key,
					direction
				}));
				res.sort((a, b) => {
					for (const criterion of criteria) {
						const compare = criterion.direction * model.compareThings(model.getDotValue(a, criterion.key), model.getDotValue(b, criterion.key), this.db.compareStrings);
						if (compare !== 0) return compare;
					}
					return 0;
				});
				const limit = this._limit || res.length;
				const skip = this._skip || 0;
				res = res.slice(skip, skip + limit);
			}
			res = this._project(res);
			if (this.mapFn) return this.mapFn(res);
			return res;
		}
		/**
		* @callback Cursor~execCallback
		* @param {Error} err
		* @param {document[]|*} res If a mapFn was given to the Cursor, then the type of this parameter is the one returned by the mapFn.
		*/
		/**
		* Callback version of {@link Cursor#exec}.
		* @param {Cursor~execCallback} _callback
		* @see Cursor#execAsync
		*/
		exec(_callback) {
			callbackify$1(() => this.execAsync())(_callback);
		}
		/**
		* Get all matching elements.
		* Will return pointers to matched elements (shallow copies), returning full copies is the role of {@link Datastore#findAsync} or {@link Datastore#findOneAsync}.
		* @return {Promise<document[]|*>}
		* @async
		*/
		execAsync() {
			return this.db.executor.pushAsync(() => this._execAsync());
		}
		then(onFulfilled, onRejected) {
			return this.execAsync().then(onFulfilled, onRejected);
		}
		catch(onRejected) {
			return this.execAsync().catch(onRejected);
		}
		finally(onFinally) {
			return this.execAsync().finally(onFinally);
		}
	};
	module.exports = Cursor;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/customUtils.js
var require_customUtils$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Utility functions that need to be reimplemented for each environment.
	* This is the version for Node.js
	* @module customUtilsNode
	* @private
	*/
	var crypto = require("crypto");
	/**
	* Return a random alphanumerical string of length len
	* There is a very small probability (less than 1/1,000,000) for the length to be less than len
	* (il the base64 conversion yields too many pluses and slashes) but
	* that's not an issue here
	* The probability of a collision is extremely small (need 3*10^12 documents to have one chance in a million of a collision)
	* See http://en.wikipedia.org/wiki/Birthday_problem
	* @param {number} len
	* @return {string}
	* @alias module:customUtilsNode.uid
	*/
	var uid = (len) => crypto.randomBytes(Math.ceil(Math.max(8, len * 2))).toString("base64").replace(/[+/]/g, "").slice(0, len);
	module.exports.uid = uid;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/waterfall.js
var require_waterfall = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Responsible for sequentially executing actions on the database
	* @private
	*/
	var Waterfall = class {
		/**
		* Instantiate a new Waterfall.
		*/
		constructor() {
			/**
			* This is the internal Promise object which resolves when all the tasks of the `Waterfall` are done.
			*
			* It will change any time `this.waterfall` is called.
			*
			* @type {Promise}
			*/
			this.guardian = Promise.resolve();
		}
		/**
		*
		* @param {AsyncFunction} func
		* @return {AsyncFunction}
		*/
		waterfall(func) {
			return (...args) => {
				this.guardian = this.guardian.then(() => {
					return func(...args).then((result) => ({
						error: false,
						result
					}), (result) => ({
						error: true,
						result
					}));
				});
				return this.guardian.then(({ error, result }) => {
					if (error) return Promise.reject(result);
					else return Promise.resolve(result);
				});
			};
		}
		/**
		* Shorthand for chaining a promise to the Waterfall
		* @param {Promise} promise
		* @return {Promise}
		*/
		chain(promise) {
			return this.waterfall(() => promise)();
		}
	};
	module.exports = Waterfall;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/executor.js
var require_executor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Waterfall = require_waterfall();
	/**
	* Executes operations sequentially.
	* Has an option for a buffer that can be triggered afterwards.
	* @private
	*/
	var Executor = class {
		/**
		* Instantiates a new Executor.
		*/
		constructor() {
			/**
			* If this.ready is `false`, then every task pushed will be buffered until this.processBuffer is called.
			* @type {boolean}
			* @private
			*/
			this.ready = false;
			/**
			* The main queue
			* @type {Waterfall}
			* @private
			*/
			this.queue = new Waterfall();
			/**
			* The buffer queue
			* @type {Waterfall}
			* @private
			*/
			this.buffer = null;
			/**
			* Method to trigger the buffer processing.
			*
			* Do not be use directly, use `this.processBuffer` instead.
			* @function
			* @private
			*/
			this._triggerBuffer = null;
			this.resetBuffer();
		}
		/**
		* If executor is ready, queue task (and process it immediately if executor was idle)
		* If not, buffer task for later processing
		* @param {AsyncFunction} task Function to execute
		* @param {boolean} [forceQueuing = false] Optional (defaults to false) force executor to queue task even if it is not ready
		* @return {Promise<*>}
		* @async
		* @see Executor#push
		*/
		pushAsync(task, forceQueuing = false) {
			if (this.ready || forceQueuing) return this.queue.waterfall(task)();
			else return this.buffer.waterfall(task)();
		}
		/**
		* Queue all tasks in buffer (in the same order they came in)
		* Automatically sets executor as ready
		*/
		processBuffer() {
			this.ready = true;
			this._triggerBuffer();
			this.queue.waterfall(() => this.buffer.guardian);
		}
		/**
		* Removes all tasks queued up in the buffer
		*/
		resetBuffer() {
			this.buffer = new Waterfall();
			this.buffer.chain(new Promise((resolve) => {
				this._triggerBuffer = resolve;
			}));
			if (this.ready) this._triggerBuffer();
		}
	};
	module.exports = Executor;
}));
//#endregion
//#region node_modules/@seald-io/binary-search-tree/lib/customUtils.js
var require_customUtils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Return an array with the numbers from 0 to n-1, in a random order
	*/
	var getRandomArray = (n) => {
		if (n === 0) return [];
		if (n === 1) return [0];
		const res = getRandomArray(n - 1);
		const next = Math.floor(Math.random() * n);
		res.splice(next, 0, n - 1);
		return res;
	};
	module.exports.getRandomArray = getRandomArray;
	var defaultCompareKeysFunction = (a, b) => {
		if (a < b) return -1;
		if (a > b) return 1;
		if (a === b) return 0;
		const err = /* @__PURE__ */ new Error("Couldn't compare elements");
		err.a = a;
		err.b = b;
		throw err;
	};
	module.exports.defaultCompareKeysFunction = defaultCompareKeysFunction;
	/**
	* Check whether two values are equal (used in non-unique deletion)
	*/
	var defaultCheckValueEquality = (a, b) => a === b;
	module.exports.defaultCheckValueEquality = defaultCheckValueEquality;
}));
//#endregion
//#region node_modules/@seald-io/binary-search-tree/lib/bst.js
var require_bst = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Simple binary search tree
	*/
	var customUtils = require_customUtils();
	var BinarySearchTree = class {
		/**
		* Constructor
		* @param {Object} options Optional
		* @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
		* @param {Key}      options.key Initialize this BST's key with key
		* @param {Value}    options.value Initialize this BST's data with [value]
		* @param {Function} options.compareKeys Initialize this BST's compareKeys
		*/
		constructor(options) {
			options = options || {};
			this.left = null;
			this.right = null;
			this.parent = options.parent !== void 0 ? options.parent : null;
			if (Object.prototype.hasOwnProperty.call(options, "key")) this.key = options.key;
			this.data = Object.prototype.hasOwnProperty.call(options, "value") ? [options.value] : [];
			this.unique = options.unique || false;
			this.compareKeys = options.compareKeys || customUtils.defaultCompareKeysFunction;
			this.checkValueEquality = options.checkValueEquality || customUtils.defaultCheckValueEquality;
		}
		/**
		* Get the descendant with max key
		*/
		getMaxKeyDescendant() {
			if (this.right) return this.right.getMaxKeyDescendant();
			else return this;
		}
		/**
		* Get the maximum key
		*/
		getMaxKey() {
			return this.getMaxKeyDescendant().key;
		}
		/**
		* Get the descendant with min key
		*/
		getMinKeyDescendant() {
			if (this.left) return this.left.getMinKeyDescendant();
			else return this;
		}
		/**
		* Get the minimum key
		*/
		getMinKey() {
			return this.getMinKeyDescendant().key;
		}
		/**
		* Check that all nodes (incl. leaves) fullfil condition given by fn
		* test is a function passed every (key, data) and which throws if the condition is not met
		*/
		checkAllNodesFullfillCondition(test) {
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return;
			test(this.key, this.data);
			if (this.left) this.left.checkAllNodesFullfillCondition(test);
			if (this.right) this.right.checkAllNodesFullfillCondition(test);
		}
		/**
		* Check that the core BST properties on node ordering are verified
		* Throw if they aren't
		*/
		checkNodeOrdering() {
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return;
			if (this.left) {
				this.left.checkAllNodesFullfillCondition((k) => {
					if (this.compareKeys(k, this.key) >= 0) throw new Error(`Tree with root ${this.key} is not a binary search tree`);
				});
				this.left.checkNodeOrdering();
			}
			if (this.right) {
				this.right.checkAllNodesFullfillCondition((k) => {
					if (this.compareKeys(k, this.key) <= 0) throw new Error(`Tree with root ${this.key} is not a binary search tree`);
				});
				this.right.checkNodeOrdering();
			}
		}
		/**
		* Check that all pointers are coherent in this tree
		*/
		checkInternalPointers() {
			if (this.left) {
				if (this.left.parent !== this) throw new Error(`Parent pointer broken for key ${this.key}`);
				this.left.checkInternalPointers();
			}
			if (this.right) {
				if (this.right.parent !== this) throw new Error(`Parent pointer broken for key ${this.key}`);
				this.right.checkInternalPointers();
			}
		}
		/**
		* Check that a tree is a BST as defined here (node ordering and pointer references)
		*/
		checkIsBST() {
			this.checkNodeOrdering();
			this.checkInternalPointers();
			if (this.parent) throw new Error("The root shouldn't have a parent");
		}
		/**
		* Get number of keys inserted
		*/
		getNumberOfKeys() {
			let res;
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return 0;
			res = 1;
			if (this.left) res += this.left.getNumberOfKeys();
			if (this.right) res += this.right.getNumberOfKeys();
			return res;
		}
		/**
		* Create a BST similar (i.e. same options except for key and value) to the current one
		* Use the same constructor (i.e. BinarySearchTree, AVLTree etc)
		* @param {Object} options see constructor
		*/
		createSimilar(options) {
			options = options || {};
			options.unique = this.unique;
			options.compareKeys = this.compareKeys;
			options.checkValueEquality = this.checkValueEquality;
			return new this.constructor(options);
		}
		/**
		* Create the left child of this BST and return it
		*/
		createLeftChild(options) {
			const leftChild = this.createSimilar(options);
			leftChild.parent = this;
			this.left = leftChild;
			return leftChild;
		}
		/**
		* Create the right child of this BST and return it
		*/
		createRightChild(options) {
			const rightChild = this.createSimilar(options);
			rightChild.parent = this;
			this.right = rightChild;
			return rightChild;
		}
		/**
		* Insert a new element
		*/
		insert(key, value) {
			if (!Object.prototype.hasOwnProperty.call(this, "key")) {
				this.key = key;
				this.data.push(value);
				return;
			}
			if (this.compareKeys(this.key, key) === 0) {
				if (this.unique) {
					const err = /* @__PURE__ */ new Error(`Can't insert key ${JSON.stringify(key)}, it violates the unique constraint`);
					err.key = key;
					err.errorType = "uniqueViolated";
					throw err;
				} else this.data.push(value);
				return;
			}
			if (this.compareKeys(key, this.key) < 0) if (this.left) this.left.insert(key, value);
			else this.createLeftChild({
				key,
				value
			});
			else if (this.right) this.right.insert(key, value);
			else this.createRightChild({
				key,
				value
			});
		}
		/**
		* Search for all data corresponding to a key
		*/
		search(key) {
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return [];
			if (this.compareKeys(this.key, key) === 0) return this.data;
			if (this.compareKeys(key, this.key) < 0) if (this.left) return this.left.search(key);
			else return [];
			else if (this.right) return this.right.search(key);
			else return [];
		}
		/**
		* Return a function that tells whether a given key matches a lower bound
		*/
		getLowerBoundMatcher(query) {
			if (!Object.prototype.hasOwnProperty.call(query, "$gt") && !Object.prototype.hasOwnProperty.call(query, "$gte")) return () => true;
			if (Object.prototype.hasOwnProperty.call(query, "$gt") && Object.prototype.hasOwnProperty.call(query, "$gte")) {
				if (this.compareKeys(query.$gte, query.$gt) === 0) return (key) => this.compareKeys(key, query.$gt) > 0;
				if (this.compareKeys(query.$gte, query.$gt) > 0) return (key) => this.compareKeys(key, query.$gte) >= 0;
				else return (key) => this.compareKeys(key, query.$gt) > 0;
			}
			if (Object.prototype.hasOwnProperty.call(query, "$gt")) return (key) => this.compareKeys(key, query.$gt) > 0;
			else return (key) => this.compareKeys(key, query.$gte) >= 0;
		}
		/**
		* Return a function that tells whether a given key matches an upper bound
		*/
		getUpperBoundMatcher(query) {
			if (!Object.prototype.hasOwnProperty.call(query, "$lt") && !Object.prototype.hasOwnProperty.call(query, "$lte")) return () => true;
			if (Object.prototype.hasOwnProperty.call(query, "$lt") && Object.prototype.hasOwnProperty.call(query, "$lte")) {
				if (this.compareKeys(query.$lte, query.$lt) === 0) return (key) => this.compareKeys(key, query.$lt) < 0;
				if (this.compareKeys(query.$lte, query.$lt) < 0) return (key) => this.compareKeys(key, query.$lte) <= 0;
				else return (key) => this.compareKeys(key, query.$lt) < 0;
			}
			if (Object.prototype.hasOwnProperty.call(query, "$lt")) return (key) => this.compareKeys(key, query.$lt) < 0;
			else return (key) => this.compareKeys(key, query.$lte) <= 0;
		}
		/**
		* Get all data for a key between bounds
		* Return it in key order
		* @param {Object} query Mongo-style query where keys are $lt, $lte, $gt or $gte (other keys are not considered)
		* @param {Functions} lbm/ubm matching functions calculated at the first recursive step
		*/
		betweenBounds(query, lbm, ubm) {
			const res = [];
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return [];
			lbm = lbm || this.getLowerBoundMatcher(query);
			ubm = ubm || this.getUpperBoundMatcher(query);
			if (lbm(this.key) && this.left) append(res, this.left.betweenBounds(query, lbm, ubm));
			if (lbm(this.key) && ubm(this.key)) append(res, this.data);
			if (ubm(this.key) && this.right) append(res, this.right.betweenBounds(query, lbm, ubm));
			return res;
		}
		/**
		* Delete the current node if it is a leaf
		* Return true if it was deleted
		*/
		deleteIfLeaf() {
			if (this.left || this.right) return false;
			if (!this.parent) {
				delete this.key;
				this.data = [];
				return true;
			}
			if (this.parent.left === this) this.parent.left = null;
			else this.parent.right = null;
			return true;
		}
		/**
		* Delete the current node if it has only one child
		* Return true if it was deleted
		*/
		deleteIfOnlyOneChild() {
			let child;
			if (this.left && !this.right) child = this.left;
			if (!this.left && this.right) child = this.right;
			if (!child) return false;
			if (!this.parent) {
				this.key = child.key;
				this.data = child.data;
				this.left = null;
				if (child.left) {
					this.left = child.left;
					child.left.parent = this;
				}
				this.right = null;
				if (child.right) {
					this.right = child.right;
					child.right.parent = this;
				}
				return true;
			}
			if (this.parent.left === this) {
				this.parent.left = child;
				child.parent = this.parent;
			} else {
				this.parent.right = child;
				child.parent = this.parent;
			}
			return true;
		}
		/**
		* Delete a key or just a value
		* @param {Key} key
		* @param {Value} value Optional. If not set, the whole key is deleted. If set, only this value is deleted
		*/
		delete(key, value) {
			const newData = [];
			let replaceWith;
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return;
			if (this.compareKeys(key, this.key) < 0) {
				if (this.left) this.left.delete(key, value);
				return;
			}
			if (this.compareKeys(key, this.key) > 0) {
				if (this.right) this.right.delete(key, value);
				return;
			}
			if (!this.compareKeys(key, this.key) === 0) return;
			if (this.data.length > 1 && value !== void 0) {
				this.data.forEach((d) => {
					if (!this.checkValueEquality(d, value)) newData.push(d);
				});
				this.data = newData;
				return;
			}
			if (this.deleteIfLeaf()) return;
			if (this.deleteIfOnlyOneChild()) return;
			if (Math.random() >= .5) {
				replaceWith = this.left.getMaxKeyDescendant();
				this.key = replaceWith.key;
				this.data = replaceWith.data;
				if (this === replaceWith.parent) {
					this.left = replaceWith.left;
					if (replaceWith.left) replaceWith.left.parent = replaceWith.parent;
				} else {
					replaceWith.parent.right = replaceWith.left;
					if (replaceWith.left) replaceWith.left.parent = replaceWith.parent;
				}
			} else {
				replaceWith = this.right.getMinKeyDescendant();
				this.key = replaceWith.key;
				this.data = replaceWith.data;
				if (this === replaceWith.parent) {
					this.right = replaceWith.right;
					if (replaceWith.right) replaceWith.right.parent = replaceWith.parent;
				} else {
					replaceWith.parent.left = replaceWith.right;
					if (replaceWith.right) replaceWith.right.parent = replaceWith.parent;
				}
			}
		}
		/**
		* Execute a function on every node of the tree, in key order
		* @param {Function} fn Signature: node. Most useful will probably be node.key and node.data
		*/
		executeOnEveryNode(fn) {
			if (this.left) this.left.executeOnEveryNode(fn);
			fn(this);
			if (this.right) this.right.executeOnEveryNode(fn);
		}
		/**
		* Pretty print a tree
		* @param {Boolean} printData To print the nodes' data along with the key
		*/
		prettyPrint(printData, spacing) {
			spacing = spacing || "";
			console.log(`${spacing}* ${this.key}`);
			if (printData) console.log(`${spacing}* ${this.data}`);
			if (!this.left && !this.right) return;
			if (this.left) this.left.prettyPrint(printData, `${spacing}  `);
			else console.log(`${spacing}  *`);
			if (this.right) this.right.prettyPrint(printData, `${spacing}  `);
			else console.log(`${spacing}  *`);
		}
	};
	function append(array, toAppend) {
		for (let i = 0; i < toAppend.length; i += 1) array.push(toAppend[i]);
	}
	module.exports = BinarySearchTree;
}));
//#endregion
//#region node_modules/@seald-io/binary-search-tree/lib/avltree.js
var require_avltree = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Self-balancing binary search tree using the AVL implementation
	*/
	var BinarySearchTree = require_bst();
	var customUtils = require_customUtils();
	var AVLTree = class {
		/**
		* Constructor
		* We can't use a direct pointer to the root node (as in the simple binary search tree)
		* as the root will change during tree rotations
		* @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
		* @param {Function} options.compareKeys Initialize this BST's compareKeys
		*/
		constructor(options) {
			this.tree = new _AVLTree(options);
		}
		checkIsAVLT() {
			this.tree.checkIsAVLT();
		}
		insert(key, value) {
			const newTree = this.tree.insert(key, value);
			if (newTree) this.tree = newTree;
		}
		delete(key, value) {
			const newTree = this.tree.delete(key, value);
			if (newTree) this.tree = newTree;
		}
	};
	var _AVLTree = class extends BinarySearchTree {
		/**
		* Constructor of the internal AVLTree
		* @param {Object} options Optional
		* @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
		* @param {Key}      options.key Initialize this BST's key with key
		* @param {Value}    options.value Initialize this BST's data with [value]
		* @param {Function} options.compareKeys Initialize this BST's compareKeys
		*/
		constructor(options) {
			super();
			options = options || {};
			this.left = null;
			this.right = null;
			this.parent = options.parent !== void 0 ? options.parent : null;
			if (Object.prototype.hasOwnProperty.call(options, "key")) this.key = options.key;
			this.data = Object.prototype.hasOwnProperty.call(options, "value") ? [options.value] : [];
			this.unique = options.unique || false;
			this.compareKeys = options.compareKeys || customUtils.defaultCompareKeysFunction;
			this.checkValueEquality = options.checkValueEquality || customUtils.defaultCheckValueEquality;
		}
		/**
		* Check the recorded height is correct for every node
		* Throws if one height doesn't match
		*/
		checkHeightCorrect() {
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return;
			if (this.left && this.left.height === void 0) throw new Error("Undefined height for node " + this.left.key);
			if (this.right && this.right.height === void 0) throw new Error("Undefined height for node " + this.right.key);
			if (this.height === void 0) throw new Error("Undefined height for node " + this.key);
			const leftH = this.left ? this.left.height : 0;
			const rightH = this.right ? this.right.height : 0;
			if (this.height !== 1 + Math.max(leftH, rightH)) throw new Error("Height constraint failed for node " + this.key);
			if (this.left) this.left.checkHeightCorrect();
			if (this.right) this.right.checkHeightCorrect();
		}
		/**
		* Return the balance factor
		*/
		balanceFactor() {
			return (this.left ? this.left.height : 0) - (this.right ? this.right.height : 0);
		}
		/**
		* Check that the balance factors are all between -1 and 1
		*/
		checkBalanceFactors() {
			if (Math.abs(this.balanceFactor()) > 1) throw new Error("Tree is unbalanced at node " + this.key);
			if (this.left) this.left.checkBalanceFactors();
			if (this.right) this.right.checkBalanceFactors();
		}
		/**
		* When checking if the BST conditions are met, also check that the heights are correct
		* and the tree is balanced
		*/
		checkIsAVLT() {
			super.checkIsBST();
			this.checkHeightCorrect();
			this.checkBalanceFactors();
		}
		/**
		* Perform a right rotation of the tree if possible
		* and return the root of the resulting tree
		* The resulting tree's nodes' heights are also updated
		*/
		rightRotation() {
			const q = this;
			const p = this.left;
			if (!p) return q;
			const b = p.right;
			if (q.parent) {
				p.parent = q.parent;
				if (q.parent.left === q) q.parent.left = p;
				else q.parent.right = p;
			} else p.parent = null;
			p.right = q;
			q.parent = p;
			q.left = b;
			if (b) b.parent = q;
			const ah = p.left ? p.left.height : 0;
			const bh = b ? b.height : 0;
			const ch = q.right ? q.right.height : 0;
			q.height = Math.max(bh, ch) + 1;
			p.height = Math.max(ah, q.height) + 1;
			return p;
		}
		/**
		* Perform a left rotation of the tree if possible
		* and return the root of the resulting tree
		* The resulting tree's nodes' heights are also updated
		*/
		leftRotation() {
			const p = this;
			const q = this.right;
			if (!q) return this;
			const b = q.left;
			if (p.parent) {
				q.parent = p.parent;
				if (p.parent.left === p) p.parent.left = q;
				else p.parent.right = q;
			} else q.parent = null;
			q.left = p;
			p.parent = q;
			p.right = b;
			if (b) b.parent = p;
			const ah = p.left ? p.left.height : 0;
			const bh = b ? b.height : 0;
			const ch = q.right ? q.right.height : 0;
			p.height = Math.max(ah, bh) + 1;
			q.height = Math.max(ch, p.height) + 1;
			return q;
		}
		/**
		* Modify the tree if its right subtree is too small compared to the left
		* Return the new root if any
		*/
		rightTooSmall() {
			if (this.balanceFactor() <= 1) return this;
			if (this.left.balanceFactor() < 0) this.left.leftRotation();
			return this.rightRotation();
		}
		/**
		* Modify the tree if its left subtree is too small compared to the right
		* Return the new root if any
		*/
		leftTooSmall() {
			if (this.balanceFactor() >= -1) return this;
			if (this.right.balanceFactor() > 0) this.right.rightRotation();
			return this.leftRotation();
		}
		/**
		* Rebalance the tree along the given path. The path is given reversed (as he was calculated
		* in the insert and delete functions).
		* Returns the new root of the tree
		* Of course, the first element of the path must be the root of the tree
		*/
		rebalanceAlongPath(path) {
			let newRoot = this;
			let rotated;
			let i;
			if (!Object.prototype.hasOwnProperty.call(this, "key")) {
				delete this.height;
				return this;
			}
			for (i = path.length - 1; i >= 0; i -= 1) {
				path[i].height = 1 + Math.max(path[i].left ? path[i].left.height : 0, path[i].right ? path[i].right.height : 0);
				if (path[i].balanceFactor() > 1) {
					rotated = path[i].rightTooSmall();
					if (i === 0) newRoot = rotated;
				}
				if (path[i].balanceFactor() < -1) {
					rotated = path[i].leftTooSmall();
					if (i === 0) newRoot = rotated;
				}
			}
			return newRoot;
		}
		/**
		* Insert a key, value pair in the tree while maintaining the AVL tree height constraint
		* Return a pointer to the root node, which may have changed
		*/
		insert(key, value) {
			const insertPath = [];
			let currentNode = this;
			if (!Object.prototype.hasOwnProperty.call(this, "key")) {
				this.key = key;
				this.data.push(value);
				this.height = 1;
				return this;
			}
			while (true) {
				if (currentNode.compareKeys(currentNode.key, key) === 0) {
					if (currentNode.unique) {
						const err = /* @__PURE__ */ new Error(`Can't insert key ${JSON.stringify(key)}, it violates the unique constraint`);
						err.key = key;
						err.errorType = "uniqueViolated";
						throw err;
					} else currentNode.data.push(value);
					return this;
				}
				insertPath.push(currentNode);
				if (currentNode.compareKeys(key, currentNode.key) < 0) if (!currentNode.left) {
					insertPath.push(currentNode.createLeftChild({
						key,
						value
					}));
					break;
				} else currentNode = currentNode.left;
				else if (!currentNode.right) {
					insertPath.push(currentNode.createRightChild({
						key,
						value
					}));
					break;
				} else currentNode = currentNode.right;
			}
			return this.rebalanceAlongPath(insertPath);
		}
		/**
		* Delete a key or just a value and return the new root of the tree
		* @param {Key} key
		* @param {Value} value Optional. If not set, the whole key is deleted. If set, only this value is deleted
		*/
		delete(key, value) {
			const newData = [];
			let replaceWith;
			let currentNode = this;
			const deletePath = [];
			if (!Object.prototype.hasOwnProperty.call(this, "key")) return this;
			while (true) {
				if (currentNode.compareKeys(key, currentNode.key) === 0) break;
				deletePath.push(currentNode);
				if (currentNode.compareKeys(key, currentNode.key) < 0) if (currentNode.left) currentNode = currentNode.left;
				else return this;
				else if (currentNode.right) currentNode = currentNode.right;
				else return this;
			}
			if (currentNode.data.length > 1 && value !== void 0) {
				currentNode.data.forEach(function(d) {
					if (!currentNode.checkValueEquality(d, value)) newData.push(d);
				});
				currentNode.data = newData;
				return this;
			}
			if (!currentNode.left && !currentNode.right) if (currentNode === this) {
				delete currentNode.key;
				currentNode.data = [];
				delete currentNode.height;
				return this;
			} else {
				if (currentNode.parent.left === currentNode) currentNode.parent.left = null;
				else currentNode.parent.right = null;
				return this.rebalanceAlongPath(deletePath);
			}
			if (!currentNode.left || !currentNode.right) {
				replaceWith = currentNode.left ? currentNode.left : currentNode.right;
				if (currentNode === this) {
					replaceWith.parent = null;
					return replaceWith;
				} else {
					if (currentNode.parent.left === currentNode) {
						currentNode.parent.left = replaceWith;
						replaceWith.parent = currentNode.parent;
					} else {
						currentNode.parent.right = replaceWith;
						replaceWith.parent = currentNode.parent;
					}
					return this.rebalanceAlongPath(deletePath);
				}
			}
			deletePath.push(currentNode);
			replaceWith = currentNode.left;
			if (!replaceWith.right) {
				currentNode.key = replaceWith.key;
				currentNode.data = replaceWith.data;
				currentNode.left = replaceWith.left;
				if (replaceWith.left) replaceWith.left.parent = currentNode;
				return this.rebalanceAlongPath(deletePath);
			}
			while (true) if (replaceWith.right) {
				deletePath.push(replaceWith);
				replaceWith = replaceWith.right;
			} else break;
			currentNode.key = replaceWith.key;
			currentNode.data = replaceWith.data;
			replaceWith.parent.right = replaceWith.left;
			if (replaceWith.left) replaceWith.left.parent = replaceWith.parent;
			return this.rebalanceAlongPath(deletePath);
		}
	};
	/**
	* Keep a pointer to the internal tree constructor for testing purposes
	*/
	AVLTree._AVLTree = _AVLTree;
	/**
	* Other functions we want to use on an AVLTree as if it were the internal _AVLTree
	*/
	[
		"getNumberOfKeys",
		"search",
		"betweenBounds",
		"prettyPrint",
		"executeOnEveryNode"
	].forEach(function(fn) {
		AVLTree.prototype[fn] = function() {
			return this.tree[fn].apply(this.tree, arguments);
		};
	});
	module.exports = AVLTree;
}));
//#endregion
//#region node_modules/@seald-io/binary-search-tree/index.js
var require_binary_search_tree = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports.BinarySearchTree = require_bst();
	module.exports.AVLTree = require_avltree();
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/indexes.js
var require_indexes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BinarySearchTree = require_binary_search_tree().AVLTree;
	var model = require_model();
	var { uniq, isDate } = require_utils();
	/**
	* Two indexed pointers are equal if they point to the same place
	* @param {*} a
	* @param {*} b
	* @return {boolean}
	* @private
	*/
	var checkValueEquality = (a, b) => a === b;
	/**
	* Type-aware projection
	* @param {*} elt
	* @return {string|*}
	* @private
	*/
	var projectForUnique = (elt) => {
		if (elt === null) return "$null";
		if (typeof elt === "string") return "$string" + elt;
		if (typeof elt === "boolean") return "$boolean" + elt;
		if (typeof elt === "number") return "$number" + elt;
		if (isDate(elt)) return "$date" + elt.getTime();
		return elt;
	};
	/**
	* Indexes on field names, with atomic operations and which can optionally enforce a unique constraint or allow indexed
	* fields to be undefined
	* @private
	*/
	var Index = class {
		/**
		* Create a new index
		* All methods on an index guarantee that either the whole operation was successful and the index changed
		* or the operation was unsuccessful and an error is thrown while the index is unchanged
		* @param {object} options
		* @param {string} options.fieldName On which field should the index apply, can use dot notation to index on sub fields, can use comma-separated notation to use compound indexes
		* @param {boolean} [options.unique = false] Enforces a unique constraint
		* @param {boolean} [options.sparse = false] Allows a sparse index (we can have documents for which fieldName is `undefined`)
		*/
		constructor(options) {
			/**
			* On which field the index applies to, can use dot notation to index on sub fields, can use comma-separated notation to use compound indexes.
			* @type {string}
			*/
			this.fieldName = options.fieldName;
			if (typeof this.fieldName !== "string") throw new Error("fieldName must be a string");
			/**
			* Internal property which is an Array representing the fieldName split with `,`, useful only for compound indexes.
			* @type {string[]}
			* @private
			*/
			this._fields = this.fieldName.split(",");
			/**
			* Defines if the index enforces a unique constraint for this index.
			* @type {boolean}
			*/
			this.unique = options.unique || false;
			/**
			* Defines if we can have documents for which fieldName is `undefined`
			* @type {boolean}
			*/
			this.sparse = options.sparse || false;
			/**
			* Options object given to the underlying BinarySearchTree.
			* @type {{unique: boolean, checkValueEquality: (function(*, *): boolean), compareKeys: ((function(*, *, compareStrings): (number|number))|*)}}
			*/
			this.treeOptions = {
				unique: this.unique,
				compareKeys: model.compareThings,
				checkValueEquality
			};
			/**
			* Underlying BinarySearchTree for this index. Uses an AVLTree for optimization.
			* @type {AVLTree}
			*/
			this.tree = new BinarySearchTree(this.treeOptions);
		}
		/**
		* Reset an index
		* @param {?document|?document[]} [newData] Data to initialize the index with. If an error is thrown during
		* insertion, the index is not modified.
		*/
		reset(newData) {
			this.tree = new BinarySearchTree(this.treeOptions);
			if (newData) this.insert(newData);
		}
		/**
		* Insert a new document in the index
		* If an array is passed, we insert all its elements (if one insertion fails the index is not modified)
		* O(log(n))
		* @param {document|document[]} doc The document, or array of documents, to insert.
		*/
		insert(doc) {
			let keys;
			let failingIndex;
			let error;
			if (Array.isArray(doc)) {
				this.insertMultipleDocs(doc);
				return;
			}
			const key = model.getDotValues(doc, this._fields);
			if ((key === void 0 || typeof key === "object" && key !== null && Object.values(key).every((el) => el === void 0)) && this.sparse) return;
			if (!Array.isArray(key)) this.tree.insert(key, doc);
			else {
				keys = uniq(key, projectForUnique);
				for (let i = 0; i < keys.length; i += 1) try {
					this.tree.insert(keys[i], doc);
				} catch (e) {
					error = e;
					failingIndex = i;
					break;
				}
				if (error) {
					for (let i = 0; i < failingIndex; i += 1) this.tree.delete(keys[i], doc);
					throw error;
				}
			}
		}
		/**
		* Insert an array of documents in the index
		* If a constraint is violated, the changes should be rolled back and an error thrown
		* @param {document[]} docs Array of documents to insert.
		* @private
		*/
		insertMultipleDocs(docs) {
			let error;
			let failingIndex;
			for (let i = 0; i < docs.length; i += 1) try {
				this.insert(docs[i]);
			} catch (e) {
				error = e;
				failingIndex = i;
				break;
			}
			if (error) {
				for (let i = 0; i < failingIndex; i += 1) this.remove(docs[i]);
				throw error;
			}
		}
		/**
		* Removes a document from the index.
		* If an array is passed, we remove all its elements
		* The remove operation is safe with regards to the 'unique' constraint
		* O(log(n))
		* @param {document[]|document} doc The document, or Array of documents, to remove.
		*/
		remove(doc) {
			if (Array.isArray(doc)) {
				doc.forEach((d) => {
					this.remove(d);
				});
				return;
			}
			const key = model.getDotValues(doc, this._fields);
			if (key === void 0 && this.sparse) return;
			if (!Array.isArray(key)) this.tree.delete(key, doc);
			else uniq(key, projectForUnique).forEach((_key) => {
				this.tree.delete(_key, doc);
			});
		}
		/**
		* Update a document in the index
		* If a constraint is violated, changes are rolled back and an error thrown
		* Naive implementation, still in O(log(n))
		* @param {document|Array.<{oldDoc: document, newDoc: document}>} oldDoc Document to update, or an `Array` of
		* `{oldDoc, newDoc}` pairs.
		* @param {document} [newDoc] Document to replace the oldDoc with. If the first argument is an `Array` of
		* `{oldDoc, newDoc}` pairs, this second argument is ignored.
		*/
		update(oldDoc, newDoc) {
			if (Array.isArray(oldDoc)) {
				this.updateMultipleDocs(oldDoc);
				return;
			}
			this.remove(oldDoc);
			try {
				this.insert(newDoc);
			} catch (e) {
				this.insert(oldDoc);
				throw e;
			}
		}
		/**
		* Update multiple documents in the index
		* If a constraint is violated, the changes need to be rolled back
		* and an error thrown
		* @param {Array.<{oldDoc: document, newDoc: document}>} pairs
		*
		* @private
		*/
		updateMultipleDocs(pairs) {
			let failingIndex;
			let error;
			for (let i = 0; i < pairs.length; i += 1) this.remove(pairs[i].oldDoc);
			for (let i = 0; i < pairs.length; i += 1) try {
				this.insert(pairs[i].newDoc);
			} catch (e) {
				error = e;
				failingIndex = i;
				break;
			}
			if (error) {
				for (let i = 0; i < failingIndex; i += 1) this.remove(pairs[i].newDoc);
				for (let i = 0; i < pairs.length; i += 1) this.insert(pairs[i].oldDoc);
				throw error;
			}
		}
		/**
		* Revert an update
		* @param {document|Array.<{oldDoc: document, newDoc: document}>} oldDoc Document to revert to, or an `Array` of `{oldDoc, newDoc}` pairs.
		* @param {document} [newDoc] Document to revert from. If the first argument is an Array of {oldDoc, newDoc}, this second argument is ignored.
		*/
		revertUpdate(oldDoc, newDoc) {
			const revert = [];
			if (!Array.isArray(oldDoc)) this.update(newDoc, oldDoc);
			else {
				oldDoc.forEach((pair) => {
					revert.push({
						oldDoc: pair.newDoc,
						newDoc: pair.oldDoc
					});
				});
				this.update(revert);
			}
		}
		/**
		* Get all documents in index whose key match value (if it is a Thing) or one of the elements of value (if it is an array of Things)
		* @param {Array.<*>|*} value Value to match the key against
		* @return {document[]}
		*/
		getMatching(value) {
			if (!Array.isArray(value)) return this.tree.search(value);
			else {
				const _res = {};
				const res = [];
				value.forEach((v) => {
					this.getMatching(v).forEach((doc) => {
						_res[doc._id] = doc;
					});
				});
				Object.keys(_res).forEach((_id) => {
					res.push(_res[_id]);
				});
				return res;
			}
		}
		/**
		* Get all documents in index whose key is between bounds are they are defined by query
		* Documents are sorted by key
		* @param {object} query An object with at least one matcher among $gt, $gte, $lt, $lte.
		* @param {*} [query.$gt] Greater than matcher.
		* @param {*} [query.$gte] Greater than or equal matcher.
		* @param {*} [query.$lt] Lower than matcher.
		* @param {*} [query.$lte] Lower than or equal matcher.
		* @return {document[]}
		*/
		getBetweenBounds(query) {
			return this.tree.betweenBounds(query);
		}
		/**
		* Get all elements in the index
		* @return {document[]}
		*/
		getAll() {
			const res = [];
			this.tree.executeOnEveryNode((node) => {
				res.push(...node.data);
			});
			return res;
		}
	};
	module.exports = Index;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/byline.js
var require_byline = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @module byline
	* @private
	*/
	var stream = require("stream");
	var timers = require("timers");
	var { Buffer: Buffer$1 } = require("buffer");
	var createLineStream = (readStream, options) => {
		if (!readStream) throw new Error("expected readStream");
		if (!readStream.readable) throw new Error("readStream must be readable");
		const ls = new LineStream(options);
		readStream.pipe(ls);
		return ls;
	};
	/**
	* Fork from {@link https://github.com/jahewson/node-byline}.
	* @see https://github.com/jahewson/node-byline
	* @alias module:byline.LineStream
	* @private
	*/
	var LineStream = class extends stream.Transform {
		constructor(options) {
			super(options);
			options = options || {};
			this._readableState.objectMode = true;
			this._lineBuffer = [];
			this._keepEmptyLines = options.keepEmptyLines || false;
			this._lastChunkEndedWithCR = false;
			this.once("pipe", (src) => {
				if (!this.encoding && src instanceof stream.Readable) this.encoding = src._readableState.encoding;
			});
		}
		_transform(chunk, encoding, done) {
			encoding = encoding || "utf8";
			if (Buffer$1.isBuffer(chunk)) if (encoding === "buffer") {
				chunk = chunk.toString();
				encoding = "utf8";
			} else chunk = chunk.toString(encoding);
			this._chunkEncoding = encoding;
			const lines = chunk.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g);
			if (this._lastChunkEndedWithCR && chunk[0] === "\n") lines.shift();
			if (this._lineBuffer.length > 0) {
				this._lineBuffer[this._lineBuffer.length - 1] += lines[0];
				lines.shift();
			}
			this._lastChunkEndedWithCR = chunk[chunk.length - 1] === "\r";
			this._lineBuffer = this._lineBuffer.concat(lines);
			this._pushBuffer(encoding, 1, done);
		}
		_pushBuffer(encoding, keep, done) {
			while (this._lineBuffer.length > keep) {
				const line = this._lineBuffer.shift();
				if (this._keepEmptyLines || line.length > 0) {
					if (!this.push(this._reencode(line, encoding))) {
						timers.setImmediate(() => {
							this._pushBuffer(encoding, keep, done);
						});
						return;
					}
				}
			}
			done();
		}
		_flush(done) {
			this._pushBuffer(this._chunkEncoding, 0, done);
		}
		_reencode(line, chunkEncoding) {
			if (this.encoding && this.encoding !== chunkEncoding) return Buffer$1.from(line, chunkEncoding).toString(this.encoding);
			else if (this.encoding) return line;
			else return Buffer$1.from(line, chunkEncoding);
		}
	};
	module.exports = createLineStream;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/storage.js
var require_storage = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Way data is stored for this database.
	* This version is the Node.js version.
	* It's essentially fs, mkdirp and crash safe write and read functions.
	*
	* @see module:storageBrowser
	* @see module:storageReactNative
	* @module storage
	* @private
	*/
	var fs$2 = require("fs");
	var fsPromises = fs$2.promises;
	var path$3 = require("path");
	var { Readable } = require("stream");
	var DEFAULT_DIR_MODE = 493;
	var DEFAULT_FILE_MODE = 420;
	/**
	* Returns true if file exists.
	* @param {string} file
	* @return {Promise<boolean>}
	* @async
	* @alias module:storage.existsAsync
	* @see module:storage.exists
	*/
	var existsAsync = (file) => fsPromises.access(file, fs$2.constants.F_OK).then(() => true, () => false);
	/**
	* Node.js' [fsPromises.rename]{@link https://nodejs.org/api/fs.html#fspromisesrenameoldpath-newpath}
	* @function
	* @param {string} oldPath
	* @param {string} newPath
	* @return {Promise<void>}
	* @alias module:storage.renameAsync
	* @async
	*/
	var renameAsync = fsPromises.rename;
	/**
	* Node.js' [fsPromises.writeFile]{@link https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options}.
	* @function
	* @param {string} path
	* @param {string} data
	* @param {object} [options]
	* @return {Promise<void>}
	* @alias module:storage.writeFileAsync
	* @async
	*/
	var writeFileAsync = fsPromises.writeFile;
	/**
	* Node.js' [fs.createWriteStream]{@link https://nodejs.org/api/fs.html#fscreatewritestreampath-options}.
	* @function
	* @param {string} path
	* @param {Object} [options]
	* @return {fs.WriteStream}
	* @alias module:storage.writeFileStream
	*/
	var writeFileStream = fs$2.createWriteStream;
	/**
	* Node.js' [fsPromises.unlink]{@link https://nodejs.org/api/fs.html#fspromisesunlinkpath}.
	* @function
	* @param {string} path
	* @return {Promise<void>}
	* @async
	* @alias module:storage.unlinkAsync
	*/
	var unlinkAsync = fsPromises.unlink;
	/**
	* Node.js' [fsPromises.appendFile]{@link https://nodejs.org/api/fs.html#fspromisesappendfilepath-data-options}.
	* @function
	* @param {string} path
	* @param {string} data
	* @param {object} [options]
	* @return {Promise<void>}
	* @alias module:storage.appendFileAsync
	* @async
	*/
	var appendFileAsync = fsPromises.appendFile;
	/**
	* Node.js' [fsPromises.readFile]{@link https://nodejs.org/api/fs.html#fspromisesreadfilepath-options}.
	* @function
	* @param {string} path
	* @param {object} [options]
	* @return {Promise<Buffer>}
	* @alias module:storage.readFileAsync
	* @async
	*/
	var readFileAsync = fsPromises.readFile;
	/**
	* Node.js' [fs.createReadStream]{@link https://nodejs.org/api/fs.html#fscreatereadstreampath-options}.
	* @function
	* @param {string} path
	* @param {Object} [options]
	* @return {fs.ReadStream}
	* @alias module:storage.readFileStream
	*/
	var readFileStream = fs$2.createReadStream;
	/**
	* Node.js' [fsPromises.mkdir]{@link https://nodejs.org/api/fs.html#fspromisesmkdirpath-options}.
	* @function
	* @param {string} path
	* @param {object} options
	* @return {Promise<void|string>}
	* @alias module:storage.mkdirAsync
	* @async
	*/
	var mkdirAsync = fsPromises.mkdir;
	/**
	* Removes file if it exists.
	* @param {string} file
	* @return {Promise<void>}
	* @alias module:storage.ensureFileDoesntExistAsync
	* @async
	*/
	var ensureFileDoesntExistAsync = async (file) => {
		if (await existsAsync(file)) await unlinkAsync(file);
	};
	/**
	* Flush data in OS buffer to storage if corresponding option is set.
	* @param {object|string} options If options is a string, it is assumed that the flush of the file (not dir) called options was requested
	* @param {string} [options.filename]
	* @param {boolean} [options.isDir = false] Optional, defaults to false
	* @param {number} [options.mode = 0o644] Optional, defaults to 0o644
	* @return {Promise<void>}
	* @alias module:storage.flushToStorageAsync
	* @async
	*/
	var flushToStorageAsync = async (options) => {
		let filename;
		let flags;
		let mode;
		if (typeof options === "string") {
			filename = options;
			flags = "r+";
			mode = DEFAULT_FILE_MODE;
		} else {
			filename = options.filename;
			flags = options.isDir ? "r" : "r+";
			mode = options.mode !== void 0 ? options.mode : DEFAULT_FILE_MODE;
		}
		/**
		* Some OSes and/or storage backends (augmented node fs) do not support fsync (FlushFileBuffers) directories,
		* or calling open() on directories at all. Flushing fails silently in this case, supported by following heuristics:
		*  + isDir === true
		*  |-- open(<dir>) -> (err.code === 'EISDIR'): can't call open() on directories (eg. BrowserFS)
		*  `-- fsync(<dir>) -> (errFS.code === 'EPERM' || errFS.code === 'EISDIR'): can't fsync directory: permissions are checked
		*        on open(); EPERM error should only occur on fsync incapability and not for general lack of permissions (e.g. Windows)
		*
		* We can live with this as it cannot cause 100% dataloss except in the very rare event of the first time
		* database is loaded and a crash happens.
		*/
		let filehandle, errorOnFsync, errorOnClose;
		try {
			filehandle = await fsPromises.open(filename, flags, mode);
			try {
				await filehandle.sync();
			} catch (errFS) {
				errorOnFsync = errFS;
			}
		} catch (error) {
			if (error.code !== "EISDIR" || !options.isDir) throw error;
		} finally {
			try {
				await filehandle.close();
			} catch (errC) {
				errorOnClose = errC;
			}
		}
		if ((errorOnFsync || errorOnClose) && !((errorOnFsync.code === "EPERM" || errorOnClose.code === "EISDIR") && options.isDir)) {
			const e = /* @__PURE__ */ new Error("Failed to flush to storage");
			e.errorOnFsync = errorOnFsync;
			e.errorOnClose = errorOnClose;
			throw e;
		}
	};
	/**
	* Fully write or rewrite the datafile.
	* @param {string} filename
	* @param {string[]} lines
	* @param {number} [mode=0o644]
	* @return {Promise<void>}
	* @alias module:storage.writeFileLinesAsync
	* @async
	*/
	var writeFileLinesAsync = (filename, lines, mode = DEFAULT_FILE_MODE) => new Promise((resolve, reject) => {
		try {
			const stream = writeFileStream(filename, { mode });
			const readable = Readable.from(lines);
			readable.on("data", (line) => {
				try {
					stream.write(line + "\n");
				} catch (err) {
					reject(err);
				}
			});
			readable.on("end", () => {
				stream.close((err) => {
					if (err) reject(err);
					else resolve();
				});
			});
			readable.on("error", (err) => {
				reject(err);
			});
			stream.on("error", (err) => {
				reject(err);
			});
		} catch (err) {
			reject(err);
		}
	});
	/**
	* Fully write or rewrite the datafile, immune to crashes during the write operation (data will not be lost).
	* @param {string} filename
	* @param {string[]} lines
	* @param {object} [modes={ fileMode: 0o644, dirMode: 0o755 }]
	* @param {number} modes.dirMode
	* @param {number} modes.fileMode
	* @return {Promise<void>}
	* @alias module:storage.crashSafeWriteFileLinesAsync
	*/
	var crashSafeWriteFileLinesAsync = async (filename, lines, modes = {
		fileMode: DEFAULT_FILE_MODE,
		dirMode: DEFAULT_DIR_MODE
	}) => {
		const tempFilename = filename + "~";
		await flushToStorageAsync({
			filename: path$3.dirname(filename),
			isDir: true,
			mode: modes.dirMode
		});
		if (await existsAsync(filename)) await flushToStorageAsync({
			filename,
			mode: modes.fileMode
		});
		await writeFileLinesAsync(tempFilename, lines, modes.fileMode);
		await flushToStorageAsync({
			filename: tempFilename,
			mode: modes.fileMode
		});
		await renameAsync(tempFilename, filename);
		await flushToStorageAsync({
			filename: path$3.dirname(filename),
			isDir: true,
			mode: modes.dirMode
		});
	};
	/**
	* Ensure the datafile contains all the data, even if there was a crash during a full file write.
	* @param {string} filename
	* @param {number} [mode=0o644]
	* @return {Promise<void>}
	* @alias module:storage.ensureDatafileIntegrityAsync
	*/
	var ensureDatafileIntegrityAsync = async (filename, mode = DEFAULT_FILE_MODE) => {
		const tempFilename = filename + "~";
		if (await existsAsync(filename)) return;
		if (!await existsAsync(tempFilename)) await writeFileAsync(filename, "", {
			encoding: "utf8",
			mode
		});
		else await renameAsync(tempFilename, filename);
	};
	/**
	* Check if a file's parent directory exists and create it on the fly if it is not the case.
	* @param {string} filename
	* @param {number} mode
	* @return {Promise<void>}
	* @private
	*/
	var ensureParentDirectoryExistsAsync = async (filename, mode) => {
		const dir = path$3.dirname(filename);
		const parsedDir = path$3.parse(path$3.resolve(dir));
		if (process.platform !== "win32" || parsedDir.dir !== parsedDir.root || parsedDir.base !== "") await mkdirAsync(dir, {
			recursive: true,
			mode
		});
	};
	module.exports.existsAsync = existsAsync;
	module.exports.renameAsync = renameAsync;
	module.exports.writeFileAsync = writeFileAsync;
	module.exports.writeFileLinesAsync = writeFileLinesAsync;
	module.exports.crashSafeWriteFileLinesAsync = crashSafeWriteFileLinesAsync;
	module.exports.appendFileAsync = appendFileAsync;
	module.exports.readFileAsync = readFileAsync;
	module.exports.unlinkAsync = unlinkAsync;
	module.exports.mkdirAsync = mkdirAsync;
	module.exports.readFileStream = readFileStream;
	module.exports.flushToStorageAsync = flushToStorageAsync;
	module.exports.ensureDatafileIntegrityAsync = ensureDatafileIntegrityAsync;
	module.exports.ensureFileDoesntExistAsync = ensureFileDoesntExistAsync;
	module.exports.ensureParentDirectoryExistsAsync = ensureParentDirectoryExistsAsync;
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/persistence.js
var require_persistence = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { deprecate: deprecate$1 } = require("util");
	var byline = require_byline();
	var Index = require_indexes();
	var model = require_model();
	var storage = require_storage();
	var Waterfall = require_waterfall();
	var DEFAULT_DIR_MODE = 493;
	var DEFAULT_FILE_MODE = 420;
	module.exports = class Persistence {
		/**
		* Create a new Persistence object for database options.db
		* @param {Datastore} options.db
		* @param {Number} [options.corruptAlertThreshold] Optional, threshold after which an alert is thrown if too much data is corrupt
		* @param {serializationHook} [options.beforeDeserialization] Hook you can use to transform data after it was serialized and before it is written to disk.
		* @param {serializationHook} [options.afterSerialization] Inverse of `afterSerialization`.
		* @param {object} [options.modes] Modes to use for FS permissions. Will not work on Windows.
		* @param {number} [options.modes.fileMode=0o644] Mode to use for files.
		* @param {number} [options.modes.dirMode=0o755] Mode to use for directories.
		*/
		constructor(options) {
			this.db = options.db;
			this.inMemoryOnly = this.db.inMemoryOnly;
			this.filename = this.db.filename;
			this.corruptAlertThreshold = options.corruptAlertThreshold !== void 0 ? options.corruptAlertThreshold : .1;
			this.modes = options.modes !== void 0 ? options.modes : {
				fileMode: DEFAULT_FILE_MODE,
				dirMode: DEFAULT_DIR_MODE
			};
			if (this.modes.fileMode === void 0) this.modes.fileMode = DEFAULT_FILE_MODE;
			if (this.modes.dirMode === void 0) this.modes.dirMode = DEFAULT_DIR_MODE;
			if (!this.inMemoryOnly && this.filename && this.filename.charAt(this.filename.length - 1) === "~") throw new Error("The datafile name can't end with a ~, which is reserved for crash safe backup files");
			if (options.afterSerialization && !options.beforeDeserialization) throw new Error("Serialization hook defined but deserialization hook undefined, cautiously refusing to start NeDB to prevent dataloss");
			if (!options.afterSerialization && options.beforeDeserialization) throw new Error("Serialization hook undefined but deserialization hook defined, cautiously refusing to start NeDB to prevent dataloss");
			this.afterSerialization = async (s) => (options.afterSerialization || ((x) => x))(s);
			this.beforeDeserialization = async (s) => (options.beforeDeserialization || ((x) => x))(s);
		}
		/**
		* Internal version without using the {@link Datastore#executor} of {@link Datastore#compactDatafileAsync}, use it instead.
		* @return {Promise<void>}
		* @private
		*/
		async persistCachedDatabaseAsync() {
			const lines = [];
			if (this.inMemoryOnly) return;
			for (const doc of this.db.getAllData()) lines.push(await this.afterSerialization(model.serialize(doc)));
			for (const fieldName of Object.keys(this.db.indexes)) if (fieldName !== "_id") lines.push(await this.afterSerialization(model.serialize({ $$indexCreated: {
				fieldName: this.db.indexes[fieldName].fieldName,
				unique: this.db.indexes[fieldName].unique,
				sparse: this.db.indexes[fieldName].sparse
			} })));
			await storage.crashSafeWriteFileLinesAsync(this.filename, lines, this.modes);
			this.db.emit("compaction.done");
		}
		/**
		* @see Datastore#compactDatafile
		* @deprecated
		* @param {NoParamCallback} [callback = () => {}]
		* @see Persistence#compactDatafileAsync
		*/
		compactDatafile(callback) {
			deprecate$1((_callback) => this.db.compactDatafile(_callback), "@seald-io/nedb: calling Datastore#persistence#compactDatafile is deprecated, please use Datastore#compactDatafile, it will be removed in the next major version.")(callback);
		}
		/**
		* @see Datastore#setAutocompactionInterval
		* @deprecated
		*/
		setAutocompactionInterval(interval) {
			deprecate$1((_interval) => this.db.setAutocompactionInterval(_interval), "@seald-io/nedb: calling Datastore#persistence#setAutocompactionInterval is deprecated, please use Datastore#setAutocompactionInterval, it will be removed in the next major version.")(interval);
		}
		/**
		* @see Datastore#stopAutocompaction
		* @deprecated
		*/
		stopAutocompaction() {
			deprecate$1(() => this.db.stopAutocompaction(), "@seald-io/nedb: calling Datastore#persistence#stopAutocompaction is deprecated, please use Datastore#stopAutocompaction, it will be removed in the next major version.")();
		}
		/**
		* Persist new state for the given newDocs (can be insertion, update or removal)
		* Use an append-only format
		*
		* Do not use directly, it should only used by a {@link Datastore} instance.
		* @param {document[]} newDocs Can be empty if no doc was updated/removed
		* @return {Promise}
		* @private
		*/
		async persistNewStateAsync(newDocs) {
			let toPersist = "";
			if (this.inMemoryOnly) return;
			for (const doc of newDocs) toPersist += await this.afterSerialization(model.serialize(doc)) + "\n";
			if (toPersist.length === 0) return;
			await storage.appendFileAsync(this.filename, toPersist, {
				encoding: "utf8",
				mode: this.modes.fileMode
			});
		}
		/**
		* @typedef rawIndex
		* @property {string} fieldName
		* @property {boolean} [unique]
		* @property {boolean} [sparse]
		*/
		/**
		* From a database's raw data, return the corresponding machine understandable collection.
		*
		* Do not use directly, it should only used by a {@link Datastore} instance.
		* @param {string} rawData database file
		* @return {{data: document[], indexes: Object.<string, rawIndex>}}
		* @private
		*/
		async treatRawData(rawData) {
			const data = rawData.split("\n").filter((datum) => datum !== "").map(async (datum) => model.deserialize(await this.beforeDeserialization(datum)));
			const dataById = {};
			const indexes = {};
			const dataLength = data.length;
			let corruptItems = 0;
			for (const docToAwait of data) try {
				const doc = await docToAwait;
				if (doc._id) if (doc.$$deleted === true) delete dataById[doc._id];
				else dataById[doc._id] = doc;
				else if (doc.$$indexCreated && doc.$$indexCreated.fieldName != null) indexes[doc.$$indexCreated.fieldName] = doc.$$indexCreated;
				else if (typeof doc.$$indexRemoved === "string") delete indexes[doc.$$indexRemoved];
			} catch (e) {
				corruptItems += 1;
			}
			if (dataLength > 0) {
				const corruptionRate = corruptItems / dataLength;
				if (corruptionRate > this.corruptAlertThreshold) {
					const error = /* @__PURE__ */ new Error(`${Math.floor(100 * corruptionRate)}% of the data file is corrupt, more than given corruptAlertThreshold (${Math.floor(100 * this.corruptAlertThreshold)}%). Cautiously refusing to start NeDB to prevent dataloss.`);
					error.corruptionRate = corruptionRate;
					error.corruptItems = corruptItems;
					error.dataLength = dataLength;
					throw error;
				}
			}
			return {
				data: Object.values(dataById),
				indexes
			};
		}
		/**
		* From a database's raw data stream, return the corresponding machine understandable collection
		* Is only used by a {@link Datastore} instance.
		*
		* Is only used in the Node.js version, since [React-Native]{@link module:storageReactNative} &
		* [browser]{@link module:storageBrowser} storage modules don't provide an equivalent of
		* {@link module:storage.readFileStream}.
		*
		* Do not use directly, it should only used by a {@link Datastore} instance.
		* @param {Readable} rawStream
		* @return {Promise<{data: document[], indexes: Object.<string, rawIndex>}>}
		* @async
		* @private
		*/
		treatRawStreamAsync(rawStream) {
			return new Promise((resolve, reject) => {
				const dataById = {};
				const indexes = {};
				let corruptItems = 0;
				const lineStream = byline(rawStream);
				let dataLength = 0;
				const waterfall = new Waterfall();
				lineStream.on("data", (line) => {
					const deserializedPromise = this.beforeDeserialization(line);
					return waterfall.waterfall(async () => {
						if (line === "") return;
						try {
							const doc = model.deserialize(await deserializedPromise);
							if (doc._id) if (doc.$$deleted === true) delete dataById[doc._id];
							else dataById[doc._id] = doc;
							else if (doc.$$indexCreated && doc.$$indexCreated.fieldName != null) indexes[doc.$$indexCreated.fieldName] = doc.$$indexCreated;
							else if (typeof doc.$$indexRemoved === "string") delete indexes[doc.$$indexRemoved];
						} catch (e) {
							corruptItems += 1;
						}
						dataLength++;
					})();
				});
				lineStream.on("end", async () => {
					await waterfall.guardian;
					if (dataLength > 0) {
						const corruptionRate = corruptItems / dataLength;
						if (corruptionRate > this.corruptAlertThreshold) {
							const error = /* @__PURE__ */ new Error(`${Math.floor(100 * corruptionRate)}% of the data file is corrupt, more than given corruptAlertThreshold (${Math.floor(100 * this.corruptAlertThreshold)}%). Cautiously refusing to start NeDB to prevent dataloss.`);
							error.corruptionRate = corruptionRate;
							error.corruptItems = corruptItems;
							error.dataLength = dataLength;
							reject(error, null);
							return;
						}
					}
					resolve({
						data: Object.values(dataById),
						indexes
					});
				});
				lineStream.on("error", function(err) {
					reject(err, null);
				});
			});
		}
		/**
		* Load the database
		* 1) Create all indexes
		* 2) Insert all data
		* 3) Compact the database
		*
		* This means pulling data out of the data file or creating it if it doesn't exist
		* Also, all data is persisted right away, which has the effect of compacting the database file
		* This operation is very quick at startup for a big collection (60ms for ~10k docs)
		*
		* Do not use directly as it does not use the [Executor]{@link Datastore.executor}, use {@link Datastore#loadDatabaseAsync} instead.
		* @return {Promise<void>}
		* @private
		*/
		async loadDatabaseAsync() {
			this.db._resetIndexes();
			if (this.inMemoryOnly) return;
			await Persistence.ensureParentDirectoryExistsAsync(this.filename, this.modes.dirMode);
			await storage.ensureDatafileIntegrityAsync(this.filename, this.modes.fileMode);
			let treatedData;
			if (storage.readFileStream) {
				const fileStream = storage.readFileStream(this.filename, {
					encoding: "utf8",
					mode: this.modes.fileMode
				});
				treatedData = await this.treatRawStreamAsync(fileStream);
			} else {
				const rawData = await storage.readFileAsync(this.filename, {
					encoding: "utf8",
					mode: this.modes.fileMode
				});
				treatedData = await this.treatRawData(rawData);
			}
			Object.keys(treatedData.indexes).forEach((key) => {
				this.db.indexes[key] = new Index(treatedData.indexes[key]);
			});
			try {
				this.db._resetIndexes(treatedData.data);
			} catch (e) {
				this.db._resetIndexes();
				throw e;
			}
			await this.db.persistence.persistCachedDatabaseAsync();
			this.db.executor.processBuffer();
		}
		/**
		* See {@link Datastore#dropDatabaseAsync}. This function uses {@link Datastore#executor} internally. Decorating this
		* function with an {@link Executor#pushAsync} will result in a deadlock.
		* @return {Promise<void>}
		* @private
		* @see Datastore#dropDatabaseAsync
		*/
		async dropDatabaseAsync() {
			this.db.stopAutocompaction();
			this.db.executor.ready = false;
			this.db.executor.resetBuffer();
			await this.db.executor.queue.guardian;
			this.db.indexes = {};
			this.db.indexes._id = new Index({
				fieldName: "_id",
				unique: true
			});
			this.db.ttlIndexes = {};
			if (!this.db.inMemoryOnly) await this.db.executor.pushAsync(async () => {
				if (await storage.existsAsync(this.filename)) await storage.unlinkAsync(this.filename);
			}, true);
		}
		/**
		* Check if a directory stat and create it on the fly if it is not the case.
		* @param {string} dir
		* @param {number} [mode=0o777]
		* @return {Promise<void>}
		* @private
		*/
		static async ensureParentDirectoryExistsAsync(dir, mode = DEFAULT_DIR_MODE) {
			return storage.ensureParentDirectoryExistsAsync(dir, mode);
		}
	};
}));
//#endregion
//#region node_modules/@seald-io/nedb/lib/datastore.js
var require_datastore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EventEmitter: EventEmitter$1 } = require("events");
	var { callbackify, deprecate } = require("util");
	var Cursor = require_cursor();
	var customUtils = require_customUtils$1();
	var Executor = require_executor();
	var Index = require_indexes();
	var model = require_model();
	var Persistence = require_persistence();
	var { isDate, pick, filterIndexNames } = require_utils();
	/**
	* Callback with no parameter
	* @callback NoParamCallback
	* @param {?Error} err
	*/
	/**
	* String comparison function.
	* ```
	*   if (a < b) return -1
	*   if (a > b) return 1
	*   return 0
	* ```
	* @callback compareStrings
	* @param {string} a
	* @param {string} b
	* @return {number}
	*/
	/**
	* Callback that returns an Array of documents.
	* @callback MultipleDocumentsCallback
	* @param {?Error} err
	* @param {?document[]} docs
	*/
	/**
	* Callback that returns a single document.
	* @callback SingleDocumentCallback
	* @param {?Error} err
	* @param {?document} docs
	*/
	/**
	* Generic async function.
	* @callback AsyncFunction
	* @param {...*} args
	* @return {Promise<*>}
	*/
	/**
	* Callback with generic parameters.
	* @callback GenericCallback
	* @param {?Error} err
	* @param {...*} args
	*/
	/**
	* Compaction event. Happens when the Datastore's Persistence has been compacted.
	* It happens when calling {@link Datastore#compactDatafileAsync}, which is called periodically if you have called
	* {@link Datastore#setAutocompactionInterval}.
	*
	* @event Datastore#event:"compaction.done"
	* @type {undefined}
	*/
	/**
	* Generic document in NeDB.
	* It consists of an Object with anything you want inside.
	* @typedef document
	* @property {?string} [_id] Internal `_id` of the document, which can be `null` or undefined at some points (when not
	* inserted yet for example).
	* @type {object}
	*/
	/**
	* Nedb query.
	*
	* Each key of a query references a field name, which can use the dot-notation to reference subfields inside nested
	* documents, arrays, arrays of subdocuments and to match a specific element of an array.
	*
	* Each value of a query can be one of the following:
	* - `string`: matches all documents which have this string as value for the referenced field name
	* - `number`: matches all documents which have this number as value for the referenced field name
	* - `Regexp`: matches all documents which have a value that matches the given `Regexp` for the referenced field name
	* - `object`: matches all documents which have this object as deep-value for the referenced field name
	* - Comparison operators: the syntax is `{ field: { $op: value } }` where `$op` is any comparison operator:
	*   - `$lt`, `$lte`: less than, less than or equal
	*   - `$gt`, `$gte`: greater than, greater than or equal
	*   - `$in`: member of. `value` must be an array of values
	*   - `$ne`, `$nin`: not equal, not a member of
	*   - `$exists`: checks whether the document posses the property `field`. `value` should be true or false
	*   - `$regex`: checks whether a string is matched by the regular expression. Contrary to MongoDB, the use of
	*   `$options` with `$regex` is not supported, because it doesn't give you more power than regex flags. Basic
	*   queries are more readable so only use the `$regex` operator when you need to use another operator with it
	*   - `$size`: if the referenced filed is an Array, matches on the size of the array
	*   - `$elemMatch`: matches if at least one array element matches the sub-query entirely
	* - Logical operators: You can combine queries using logical operators:
	*   - For `$or` and `$and`, the syntax is `{ $op: [query1, query2, ...] }`.
	*   - For `$not`, the syntax is `{ $not: query }`
	*   - For `$where`, the syntax is:
	*   ```
	*   { $where: function () {
	*     // object is 'this'
	*     // return a boolean
	*   } }
	*   ```
	* @typedef query
	* @type {Object.<string, *>}
	*/
	/**
	* Nedb projection.
	*
	* You can give `find` and `findOne` an optional second argument, `projections`.
	* The syntax is the same as MongoDB: `{ a: 1, b: 1 }` to return only the `a`
	* and `b` fields, `{ a: 0, b: 0 }` to omit these two fields. You cannot use both
	* modes at the time, except for `_id` which is by default always returned and
	* which you can choose to omit. You can project on nested documents.
	*
	* To reference subfields, you can use the dot-notation.
	*
	* @typedef projection
	* @type {Object.<string, 0|1>}
	*/
	/**
	* The `beforeDeserialization` and `afterSerialization` callbacks are hooks which are executed respectively before
	* parsing each document and after stringifying them. They can be used for example to encrypt the Datastore.
	* The `beforeDeserialization` should revert what `afterSerialization` has done.
	* @callback serializationHook
	* @param {string} x
	* @return {string|Promise<string>}
	*/
	/**
	* @external EventEmitter
	* @see http://nodejs.org/api/events.html
	*/
	/**
	* @class
	* @classdesc The `Datastore` class is the main class of NeDB.
	* @extends external:EventEmitter
	* @emits Datastore#event:"compaction.done"
	* @typicalname NeDB
	*/
	var Datastore = class extends EventEmitter$1 {
		/**
		* Create a new collection, either persistent or in-memory.
		*
		* If you use a persistent datastore without the `autoload` option, you need to call {@link Datastore#loadDatabase} or
		* {@link Datastore#loadDatabaseAsync} manually. This function fetches the data from datafile and prepares the database.
		* **Don't forget it!** If you use a persistent datastore, no command (insert, find, update, remove) will be executed
		* before it is called, so make sure to call it yourself or use the `autoload` option.
		*
		* Also, if loading fails, all commands registered to the {@link Datastore#executor} afterwards will not be executed.
		* They will be registered and executed, in sequence, only after a successful loading.
		*
		* @param {object|string} options Can be an object or a string. If options is a string, the behavior is the same as in
		* v0.6: it will be interpreted as `options.filename`. **Giving a string is deprecated, and will be removed in the
		* next major version.**
		* @param {string} [options.filename = null] Path to the file where the data is persisted. If left blank, the datastore is
		* automatically considered in-memory only. It cannot end with a `~` which is used in the temporary files NeDB uses to
		* perform crash-safe writes. Not used if `options.inMemoryOnly` is `true`.
		* @param {boolean} [options.inMemoryOnly = false] If set to true, no data will be written in storage. This option has
		* priority over `options.filename`.
		* @param {object} [options.modes] Permissions to use for FS. Only used for Node.js storage module. Will not work on Windows.
		* @param {number} [options.modes.fileMode = 0o644] Permissions to use for database files
		* @param {number} [options.modes.dirMode = 0o755] Permissions to use for database directories
		* @param {boolean} [options.timestampData = false] If set to true, createdAt and updatedAt will be created and
		* populated automatically (if not specified by user)
		* @param {boolean} [options.autoload = false] If used, the database will automatically be loaded from the datafile
		* upon creation (you don't need to call `loadDatabase`). Any command issued before load is finished is buffered and
		* will be executed when load is done. When autoloading is done, you can either use the `onload` callback, or you can
		* use `this.autoloadPromise` which resolves (or rejects) when autloading is done.
		* @param {NoParamCallback} [options.onload] If you use autoloading, this is the handler called after the `loadDatabase`. It
		* takes one `error` argument. If you use autoloading without specifying this handler, and an error happens during
		* load, an error will be thrown.
		* @param {serializationHook} [options.beforeDeserialization] Hook you can use to transform data after it was serialized and
		* before it is written to disk. Can be used for example to encrypt data before writing database to disk. This
		* function takes a string as parameter (one line of an NeDB data file) and outputs the transformed string, **which
		* must absolutely not contain a `\n` character** (or data will be lost).
		* @param {serializationHook} [options.afterSerialization] Inverse of `afterSerialization`. Make sure to include both and not
		* just one, or you risk data loss. For the same reason, make sure both functions are inverses of one another. Some
		* failsafe mechanisms are in place to prevent data loss if you misuse the serialization hooks: NeDB checks that never
		* one is declared without the other, and checks that they are reverse of one another by testing on random strings of
		* various lengths. In addition, if too much data is detected as corrupt, NeDB will refuse to start as it could mean
		* you're not using the deserialization hook corresponding to the serialization hook used before.
		* @param {number} [options.corruptAlertThreshold = 0.1] Between 0 and 1, defaults to 10%. NeDB will refuse to start
		* if more than this percentage of the datafile is corrupt. 0 means you don't tolerate any corruption, 1 means you
		* don't care.
		* @param {compareStrings} [options.compareStrings] If specified, it overrides default string comparison which is not
		* well adapted to non-US characters in particular accented letters. Native `localCompare` will most of the time be
		* the right choice.
		* @param {boolean} [options.testSerializationHooks=true] Whether to test the serialization hooks or not,
		* might be CPU-intensive
		*/
		constructor(options) {
			super();
			let filename;
			if (typeof options === "string") deprecate(() => {
				filename = options;
				this.inMemoryOnly = false;
			}, "@seald-io/nedb: Giving a string to the Datastore constructor is deprecated and will be removed in the next major version. Please use an options object with an argument 'filename'.")();
			else {
				options = options || {};
				filename = options.filename;
				/**
				* Determines if the `Datastore` keeps data in-memory, or if it saves it in storage. Is not read after
				* instanciation.
				* @type {boolean}
				* @protected
				*/
				this.inMemoryOnly = options.inMemoryOnly || false;
				/**
				* Determines if the `Datastore` should autoload the database upon instantiation. Is not read after instanciation.
				* @type {boolean}
				* @protected
				*/
				this.autoload = options.autoload || false;
				/**
				* Determines if the `Datastore` should add `createdAt` and `updatedAt` fields automatically if not set by the user.
				* @type {boolean}
				* @protected
				*/
				this.timestampData = options.timestampData || false;
			}
			if (!filename || typeof filename !== "string" || filename.length === 0) {
				/**
				* If null, it means `inMemoryOnly` is `true`. The `filename` is the name given to the storage module. Is not read
				* after instanciation.
				* @type {?string}
				* @protected
				*/
				this.filename = null;
				this.inMemoryOnly = true;
			} else this.filename = filename;
			/**
			* Overrides default string comparison which is not well adapted to non-US characters in particular accented
			* letters. Native `localCompare` will most of the time be the right choice
			* @type {compareStrings}
			* @function
			* @protected
			*/
			this.compareStrings = options.compareStrings;
			/**
			* The `Persistence` instance for this `Datastore`.
			* @type {Persistence}
			*/
			this.persistence = new Persistence({
				db: this,
				afterSerialization: options.afterSerialization,
				beforeDeserialization: options.beforeDeserialization,
				corruptAlertThreshold: options.corruptAlertThreshold,
				modes: options.modes,
				testSerializationHooks: options.testSerializationHooks
			});
			/**
			* The `Executor` instance for this `Datastore`. It is used in all methods exposed by the {@link Datastore},
			* any {@link Cursor} produced by the `Datastore` and by {@link Datastore#compactDatafileAsync} to ensure operations
			* are performed sequentially in the database.
			* @type {Executor}
			* @protected
			*/
			this.executor = new Executor();
			if (this.inMemoryOnly) this.executor.ready = true;
			/**
			* Indexed by field name, dot notation can be used.
			* _id is always indexed and since _ids are generated randomly the underlying binary search tree is always well-balanced
			* @type {Object.<string, Index>}
			* @protected
			*/
			this.indexes = {};
			this.indexes._id = new Index({
				fieldName: "_id",
				unique: true
			});
			/**
			* Stores the time to live (TTL) of the indexes created. The key represents the field name, the value the number of
			* seconds after which data with this index field should be removed.
			* @type {Object.<string, number>}
			* @protected
			*/
			this.ttlIndexes = {};
			if (this.autoload) {
				/**
				* A Promise that resolves when the autoload has finished.
				*
				* The onload callback is not awaited by this Promise, it is started immediately after that.
				* @type {?Promise}
				*/
				this.autoloadPromise = this.loadDatabaseAsync();
				this.autoloadPromise.then(() => {
					if (options.onload) options.onload();
				}, (err) => {
					if (options.onload) options.onload(err);
					else throw err;
				});
			} else this.autoloadPromise = null;
			/**
			* Interval if {@link Datastore#setAutocompactionInterval} was called.
			* @private
			* @type {null|number}
			*/
			this._autocompactionIntervalId = null;
		}
		/**
		* Queue a compaction/rewrite of the datafile.
		* It works by rewriting the database file, and compacts it since the cache always contains only the number of
		* documents in the collection while the data file is append-only so it may grow larger.
		*
		* @async
		*/
		compactDatafileAsync() {
			return this.executor.pushAsync(() => this.persistence.persistCachedDatabaseAsync());
		}
		/**
		* Callback version of {@link Datastore#compactDatafileAsync}.
		* @param {NoParamCallback} [callback = () => {}]
		* @see Datastore#compactDatafileAsync
		*/
		compactDatafile(callback) {
			const promise = this.compactDatafileAsync();
			if (typeof callback === "function") callbackify(() => promise)(callback);
		}
		/**
		* Set automatic compaction every `interval` ms
		* @param {Number} interval in milliseconds, with an enforced minimum of 5000 milliseconds
		*/
		setAutocompactionInterval(interval) {
			const minInterval = 5e3;
			if (Number.isNaN(Number(interval))) throw new Error("Interval must be a non-NaN number");
			const realInterval = Math.max(Number(interval), minInterval);
			this.stopAutocompaction();
			this._autocompactionIntervalId = setInterval(() => {
				this.compactDatafile();
			}, realInterval);
		}
		/**
		* Stop autocompaction (do nothing if automatic compaction was not running)
		*/
		stopAutocompaction() {
			if (this._autocompactionIntervalId) {
				clearInterval(this._autocompactionIntervalId);
				this._autocompactionIntervalId = null;
			}
		}
		/**
		* Callback version of {@link Datastore#loadDatabaseAsync}.
		* @param {NoParamCallback} [callback]
		* @see Datastore#loadDatabaseAsync
		*/
		loadDatabase(callback) {
			const promise = this.loadDatabaseAsync();
			if (typeof callback === "function") callbackify(() => promise)(callback);
		}
		/**
		* Stops auto-compaction, finishes all queued operations, drops the database both in memory and in storage.
		* **WARNING**: it is not recommended re-using an instance of NeDB if its database has been dropped, it is
		* preferable to instantiate a new one.
		* @async
		* @return {Promise}
		*/
		dropDatabaseAsync() {
			return this.persistence.dropDatabaseAsync();
		}
		/**
		* Callback version of {@link Datastore#dropDatabaseAsync}.
		* @param {NoParamCallback} [callback]
		* @see Datastore#dropDatabaseAsync
		*/
		dropDatabase(callback) {
			const promise = this.dropDatabaseAsync();
			if (typeof callback === "function") callbackify(() => promise)(callback);
		}
		/**
		* Load the database from the datafile, and trigger the execution of buffered commands if any.
		* @async
		* @return {Promise}
		*/
		loadDatabaseAsync() {
			return this.executor.pushAsync(() => this.persistence.loadDatabaseAsync(), true);
		}
		/**
		* Get an array of all the data in the database.
		* @return {document[]}
		*/
		getAllData() {
			return this.indexes._id.getAll();
		}
		/**
		* Reset all currently defined indexes.
		* @param {?document|?document[]} [newData]
		* @private
		*/
		_resetIndexes(newData) {
			for (const index of Object.values(this.indexes)) index.reset(newData);
		}
		/**
		* Callback version of {@link Datastore#ensureIndex}.
		* @param {object} options
		* @param {string|string[]} options.fieldName
		* @param {boolean} [options.unique = false]
		* @param {boolean} [options.sparse = false]
		* @param {number} [options.expireAfterSeconds]
		* @param {NoParamCallback} [callback]
		* @see Datastore#ensureIndex
		*/
		ensureIndex(options = {}, callback) {
			const promise = this.ensureIndexAsync(options);
			if (typeof callback === "function") callbackify(() => promise)(callback);
		}
		/**
		* Ensure an index is kept for this field. Same parameters as lib/indexes
		* This function acts synchronously on the indexes, however the persistence of the indexes is deferred with the
		* executor.
		* @param {object} options
		* @param {string|string[]} options.fieldName Name of the field to index. Use the dot notation to index a field in a nested
		* document. For a compound index, use an array of field names. Using a comma in a field name is not permitted.
		* @param {boolean} [options.unique = false] Enforce field uniqueness. Note that a unique index will raise an error
		* if you try to index two documents for which the field is not defined.
		* @param {boolean} [options.sparse = false] Don't index documents for which the field is not defined. Use this option
		* along with "unique" if you want to accept multiple documents for which it is not defined.
		* @param {number} [options.expireAfterSeconds] - If set, the created index is a TTL (time to live) index, that will
		* automatically remove documents when the system date becomes larger than the date on the indexed field plus
		* `expireAfterSeconds`. Documents where the indexed field is not specified or not a `Date` object are ignored.
		* @return {Promise<void>}
		*/
		async ensureIndexAsync(options = {}) {
			if (!options.fieldName) {
				const err = /* @__PURE__ */ new Error("Cannot create an index without a fieldName");
				err.missingFieldName = true;
				throw err;
			}
			const _fields = [].concat(options.fieldName).sort();
			if (_fields.some((field) => field.includes(","))) throw new Error("Cannot use comma in index fieldName");
			const _options = {
				...options,
				fieldName: _fields.join(",")
			};
			if (this.indexes[_options.fieldName]) return;
			this.indexes[_options.fieldName] = new Index(_options);
			if (options.expireAfterSeconds !== void 0) this.ttlIndexes[_options.fieldName] = _options.expireAfterSeconds;
			try {
				this.indexes[_options.fieldName].insert(this.getAllData());
			} catch (e) {
				delete this.indexes[_options.fieldName];
				throw e;
			}
			await this.executor.pushAsync(() => this.persistence.persistNewStateAsync([{ $$indexCreated: _options }]), true);
		}
		/**
		* Callback version of {@link Datastore#removeIndexAsync}.
		* @param {string} fieldName
		* @param {NoParamCallback} [callback]
		* @see Datastore#removeIndexAsync
		*/
		removeIndex(fieldName, callback = () => {}) {
			const promise = this.removeIndexAsync(fieldName);
			callbackify(() => promise)(callback);
		}
		/**
		* Remove an index.
		* @param {string} fieldName Field name of the index to remove. Use the dot notation to remove an index referring to a
		* field in a nested document.
		* @return {Promise<void>}
		* @see Datastore#removeIndex
		*/
		async removeIndexAsync(fieldName) {
			delete this.indexes[fieldName];
			await this.executor.pushAsync(() => this.persistence.persistNewStateAsync([{ $$indexRemoved: fieldName }]), true);
		}
		/**
		* Add one or several document(s) to all indexes.
		*
		* This is an internal function.
		* @param {document} doc
		* @private
		*/
		_addToIndexes(doc) {
			let failingIndex;
			let error;
			const keys = Object.keys(this.indexes);
			for (let i = 0; i < keys.length; i += 1) try {
				this.indexes[keys[i]].insert(doc);
			} catch (e) {
				failingIndex = i;
				error = e;
				break;
			}
			if (error) {
				for (let i = 0; i < failingIndex; i += 1) this.indexes[keys[i]].remove(doc);
				throw error;
			}
		}
		/**
		* Remove one or several document(s) from all indexes.
		*
		* This is an internal function.
		* @param {document} doc
		* @private
		*/
		_removeFromIndexes(doc) {
			for (const index of Object.values(this.indexes)) index.remove(doc);
		}
		/**
		* Update one or several documents in all indexes.
		*
		* To update multiple documents, oldDoc must be an array of { oldDoc, newDoc } pairs.
		*
		* If one update violates a constraint, all changes are rolled back.
		*
		* This is an internal function.
		* @param {document|Array.<{oldDoc: document, newDoc: document}>} oldDoc Document to update, or an `Array` of
		* `{oldDoc, newDoc}` pairs.
		* @param {document} [newDoc] Document to replace the oldDoc with. If the first argument is an `Array` of
		* `{oldDoc, newDoc}` pairs, this second argument is ignored.
		* @private
		*/
		_updateIndexes(oldDoc, newDoc) {
			let failingIndex;
			let error;
			const keys = Object.keys(this.indexes);
			for (let i = 0; i < keys.length; i += 1) try {
				this.indexes[keys[i]].update(oldDoc, newDoc);
			} catch (e) {
				failingIndex = i;
				error = e;
				break;
			}
			if (error) {
				for (let i = 0; i < failingIndex; i += 1) this.indexes[keys[i]].revertUpdate(oldDoc, newDoc);
				throw error;
			}
		}
		/**
		* Get all candidate documents matching the query, regardless of their expiry status.
		* @param {query} query
		* @return {document[]}
		*
		* @private
		*/
		_getRawCandidates(query) {
			const indexNames = Object.keys(this.indexes);
			let usableQuery;
			usableQuery = Object.entries(query).filter(filterIndexNames(indexNames)).pop();
			if (usableQuery) return this.indexes[usableQuery[0]].getMatching(usableQuery[1]);
			const compoundQueryKeys = indexNames.filter((indexName) => indexName.indexOf(",") !== -1).map((indexName) => indexName.split(",")).filter((subIndexNames) => Object.entries(query).filter(filterIndexNames(subIndexNames)).length === subIndexNames.length);
			if (compoundQueryKeys.length > 0) return this.indexes[compoundQueryKeys[0]].getMatching(pick(query, compoundQueryKeys[0]));
			usableQuery = Object.entries(query).filter(([k, v]) => !!(query[k] && Object.prototype.hasOwnProperty.call(query[k], "$in")) && indexNames.includes(k)).pop();
			if (usableQuery) return this.indexes[usableQuery[0]].getMatching(usableQuery[1].$in);
			usableQuery = Object.entries(query).filter(([k, v]) => !!(query[k] && (Object.prototype.hasOwnProperty.call(query[k], "$lt") || Object.prototype.hasOwnProperty.call(query[k], "$lte") || Object.prototype.hasOwnProperty.call(query[k], "$gt") || Object.prototype.hasOwnProperty.call(query[k], "$gte"))) && indexNames.includes(k)).pop();
			if (usableQuery) return this.indexes[usableQuery[0]].getBetweenBounds(usableQuery[1]);
			return this.getAllData();
		}
		/**
		* Return the list of candidates for a given query
		* Crude implementation for now, we return the candidates given by the first usable index if any
		* We try the following query types, in this order: basic match, $in match, comparison match
		* One way to make it better would be to enable the use of multiple indexes if the first usable index
		* returns too much data. I may do it in the future.
		*
		* Returned candidates will be scanned to find and remove all expired documents
		*
		* This is an internal function.
		* @param {query} query
		* @param {boolean} [dontExpireStaleDocs = false] If true don't remove stale docs. Useful for the remove function
		* which shouldn't be impacted by expirations.
		* @return {Promise<document[]>} candidates
		* @private
		*/
		async _getCandidatesAsync(query, dontExpireStaleDocs = false) {
			const validDocs = [];
			const docs = this._getRawCandidates(query);
			if (!dontExpireStaleDocs) {
				const expiredDocsIds = [];
				const ttlIndexesFieldNames = Object.keys(this.ttlIndexes);
				docs.forEach((doc) => {
					if (ttlIndexesFieldNames.every((i) => !(doc[i] !== void 0 && isDate(doc[i]) && Date.now() > doc[i].getTime() + this.ttlIndexes[i] * 1e3))) validDocs.push(doc);
					else expiredDocsIds.push(doc._id);
				});
				for (const _id of expiredDocsIds) await this._removeAsync({ _id }, {});
			} else validDocs.push(...docs);
			return validDocs;
		}
		/**
		* Insert a new document
		* This is an internal function, use {@link Datastore#insertAsync} which has the same signature.
		* @param {document|document[]} newDoc
		* @return {Promise<document|document[]>}
		* @private
		*/
		async _insertAsync(newDoc) {
			const preparedDoc = this._prepareDocumentForInsertion(newDoc);
			this._insertInCache(preparedDoc);
			await this.persistence.persistNewStateAsync(Array.isArray(preparedDoc) ? preparedDoc : [preparedDoc]);
			return model.deepCopy(preparedDoc);
		}
		/**
		* Create a new _id that's not already in use
		* @return {string} id
		* @private
		*/
		_createNewId() {
			let attemptId = customUtils.uid(16);
			if (this.indexes._id.getMatching(attemptId).length > 0) attemptId = this._createNewId();
			return attemptId;
		}
		/**
		* Prepare a document (or array of documents) to be inserted in a database
		* Meaning adds _id and timestamps if necessary on a copy of newDoc to avoid any side effect on user input
		* @param {document|document[]} newDoc document, or Array of documents, to prepare
		* @return {document|document[]} prepared document, or Array of prepared documents
		* @private
		*/
		_prepareDocumentForInsertion(newDoc) {
			let preparedDoc;
			if (Array.isArray(newDoc)) {
				preparedDoc = [];
				newDoc.forEach((doc) => {
					preparedDoc.push(this._prepareDocumentForInsertion(doc));
				});
			} else {
				preparedDoc = model.deepCopy(newDoc);
				if (preparedDoc._id === void 0) preparedDoc._id = this._createNewId();
				const now = /* @__PURE__ */ new Date();
				if (this.timestampData && preparedDoc.createdAt === void 0) preparedDoc.createdAt = now;
				if (this.timestampData && preparedDoc.updatedAt === void 0) preparedDoc.updatedAt = now;
				model.checkObject(preparedDoc);
			}
			return preparedDoc;
		}
		/**
		* If newDoc is an array of documents, this will insert all documents in the cache
		* @param {document|document[]} preparedDoc
		* @private
		*/
		_insertInCache(preparedDoc) {
			if (Array.isArray(preparedDoc)) this._insertMultipleDocsInCache(preparedDoc);
			else this._addToIndexes(preparedDoc);
		}
		/**
		* If one insertion fails (e.g. because of a unique constraint), roll back all previous
		* inserts and throws the error
		* @param {document[]} preparedDocs
		* @private
		*/
		_insertMultipleDocsInCache(preparedDocs) {
			let failingIndex;
			let error;
			for (let i = 0; i < preparedDocs.length; i += 1) try {
				this._addToIndexes(preparedDocs[i]);
			} catch (e) {
				error = e;
				failingIndex = i;
				break;
			}
			if (error) {
				for (let i = 0; i < failingIndex; i += 1) this._removeFromIndexes(preparedDocs[i]);
				throw error;
			}
		}
		/**
		* Callback version of {@link Datastore#insertAsync}.
		* @param {document|document[]} newDoc
		* @param {SingleDocumentCallback|MultipleDocumentsCallback} [callback]
		* @see Datastore#insertAsync
		*/
		insert(newDoc, callback) {
			const promise = this.insertAsync(newDoc);
			if (typeof callback === "function") callbackify(() => promise)(callback);
		}
		/**
		* Insert a new document, or new documents.
		* @param {document|document[]} newDoc Document or array of documents to insert.
		* @return {Promise<document|document[]>} The document(s) inserted.
		* @async
		*/
		insertAsync(newDoc) {
			return this.executor.pushAsync(() => this._insertAsync(newDoc));
		}
		/**
		* Callback for {@link Datastore#countCallback}.
		* @callback Datastore~countCallback
		* @param {?Error} err
		* @param {?number} count
		*/
		/**
		* Callback-version of {@link Datastore#countAsync}.
		* @param {query} query
		* @param {Datastore~countCallback} [callback]
		* @return {Cursor<number>|undefined}
		* @see Datastore#countAsync
		*/
		count(query, callback) {
			const cursor = this.countAsync(query);
			if (typeof callback === "function") callbackify(cursor.execAsync.bind(cursor))(callback);
			else return cursor;
		}
		/**
		* Count all documents matching the query.
		* @param {query} query MongoDB-style query
		* @return {Cursor<number>} count
		* @async
		*/
		countAsync(query) {
			return new Cursor(this, query, (docs) => docs.length);
		}
		/**
		* Callback version of {@link Datastore#findAsync}.
		* @param {query} query
		* @param {projection|MultipleDocumentsCallback} [projection = {}]
		* @param {MultipleDocumentsCallback} [callback]
		* @return {Cursor<document[]>|undefined}
		* @see Datastore#findAsync
		*/
		find(query, projection, callback) {
			if (arguments.length === 1) projection = {};
			else if (arguments.length === 2) {
				if (typeof projection === "function") {
					callback = projection;
					projection = {};
				}
			}
			const cursor = this.findAsync(query, projection);
			if (typeof callback === "function") callbackify(cursor.execAsync.bind(cursor))(callback);
			else return cursor;
		}
		/**
		* Find all documents matching the query.
		* We return the {@link Cursor} that the user can either `await` directly or use to can {@link Cursor#limit} or
		* {@link Cursor#skip} before.
		* @param {query} query MongoDB-style query
		* @param {projection} [projection = {}] MongoDB-style projection
		* @return {Cursor<document[]>}
		* @async
		*/
		findAsync(query, projection = {}) {
			const cursor = new Cursor(this, query, (docs) => docs.map((doc) => model.deepCopy(doc)));
			cursor.projection(projection);
			return cursor;
		}
		/**
		* @callback Datastore~findOneCallback
		* @param {?Error} err
		* @param {document} doc
		*/
		/**
		* Callback version of {@link Datastore#findOneAsync}.
		* @param {query} query
		* @param {projection|SingleDocumentCallback} [projection = {}]
		* @param {SingleDocumentCallback} [callback]
		* @return {Cursor<document>|undefined}
		* @see Datastore#findOneAsync
		*/
		findOne(query, projection, callback) {
			if (arguments.length === 1) projection = {};
			else if (arguments.length === 2) {
				if (typeof projection === "function") {
					callback = projection;
					projection = {};
				}
			}
			const cursor = this.findOneAsync(query, projection);
			if (typeof callback === "function") callbackify(cursor.execAsync.bind(cursor))(callback);
			else return cursor;
		}
		/**
		* Find one document matching the query.
		* We return the {@link Cursor} that the user can either `await` directly or use to can {@link Cursor#skip} before.
		* @param {query} query MongoDB-style query
		* @param {projection} projection MongoDB-style projection
		* @return {Cursor<document>}
		*/
		findOneAsync(query, projection = {}) {
			const cursor = new Cursor(this, query, (docs) => docs.length === 1 ? model.deepCopy(docs[0]) : null);
			cursor.projection(projection).limit(1);
			return cursor;
		}
		/**
		* See {@link Datastore#updateAsync} return type for the definition of the callback parameters.
		*
		* **WARNING:** Prior to 3.0.0, `upsert` was either `true` of falsy (but not `false`), it is now always a boolean.
		* `affectedDocuments` could be `undefined` when `returnUpdatedDocs` was `false`, it is now `null` in these cases.
		*
		* **WARNING:** Prior to 1.8.0, the `upsert` argument was not given, it was impossible for the developer to determine
		* during a `{ multi: false, returnUpdatedDocs: true, upsert: true }` update if it inserted a document or just updated
		* it.
		*
		* @callback Datastore~updateCallback
		* @param {?Error} err
		* @param {number} numAffected
		* @param {?document[]|?document} affectedDocuments
		* @param {boolean} upsert
		* @see {Datastore#updateAsync}
		*/
		/**
		* Version without the using {@link Datastore~executor} of {@link Datastore#updateAsync}, use it instead.
		*
		* @param {query} query
		* @param {document|update} update
		* @param {Object} options
		* @param {boolean} [options.multi = false]
		* @param {boolean} [options.upsert = false]
		* @param {boolean} [options.returnUpdatedDocs = false]
		* @return {Promise<{numAffected: number, affectedDocuments: document[]|document|null, upsert: boolean}>}
		* @private
		* @see Datastore#updateAsync
		*/
		async _updateAsync(query, update, options) {
			const multi = options.multi !== void 0 ? options.multi : false;
			if (options.upsert !== void 0 ? options.upsert : false) {
				if ((await new Cursor(this, query).limit(1)._execAsync()).length !== 1) {
					let toBeInserted;
					try {
						model.checkObject(update);
						toBeInserted = update;
					} catch (e) {
						toBeInserted = model.modify(model.deepCopy(query, true), update);
					}
					return {
						numAffected: 1,
						affectedDocuments: await this._insertAsync(toBeInserted),
						upsert: true
					};
				}
			}
			let numReplaced = 0;
			let modifiedDoc;
			const modifications = [];
			let createdAt;
			const candidates = await this._getCandidatesAsync(query);
			for (const candidate of candidates) if (model.match(candidate, query) && (multi || numReplaced === 0)) {
				numReplaced += 1;
				if (this.timestampData) createdAt = candidate.createdAt;
				modifiedDoc = model.modify(candidate, update);
				if (this.timestampData) {
					modifiedDoc.createdAt = createdAt;
					modifiedDoc.updatedAt = /* @__PURE__ */ new Date();
				}
				modifications.push({
					oldDoc: candidate,
					newDoc: modifiedDoc
				});
			}
			this._updateIndexes(modifications);
			const updatedDocs = modifications.map((x) => x.newDoc);
			await this.persistence.persistNewStateAsync(updatedDocs);
			if (!options.returnUpdatedDocs) return {
				numAffected: numReplaced,
				upsert: false,
				affectedDocuments: null
			};
			else {
				let updatedDocsDC = [];
				updatedDocs.forEach((doc) => {
					updatedDocsDC.push(model.deepCopy(doc));
				});
				if (!multi) updatedDocsDC = updatedDocsDC[0];
				return {
					numAffected: numReplaced,
					affectedDocuments: updatedDocsDC,
					upsert: false
				};
			}
		}
		/**
		* Callback version of {@link Datastore#updateAsync}.
		* @param {query} query
		* @param {document|*} update
		* @param {Object|Datastore~updateCallback} [options|]
		* @param {boolean} [options.multi = false]
		* @param {boolean} [options.upsert = false]
		* @param {boolean} [options.returnUpdatedDocs = false]
		* @param {Datastore~updateCallback} [callback]
		* @see Datastore#updateAsync
		*
		*/
		update(query, update, options, callback) {
			if (typeof options === "function") {
				callback = options;
				options = {};
			}
			const _callback = (err, res = {}) => {
				if (callback) callback(err, res.numAffected, res.affectedDocuments, res.upsert);
			};
			callbackify((query, update, options) => this.updateAsync(query, update, options))(query, update, options, _callback);
		}
		/**
		* Update all docs matching query.
		* @param {query} query is the same kind of finding query you use with `find` and `findOne`.
		* @param {document|*} update specifies how the documents should be modified. It is either a new document or a
		* set of modifiers (you cannot use both together, it doesn't make sense!). Using a new document will replace the
		* matched docs. Using a set of modifiers will create the fields they need to modify if they don't exist, and you can
		* apply them to subdocs. Available field modifiers are `$set` to change a field's value, `$unset` to delete a field,
		* `$inc` to increment a field's value and `$min`/`$max` to change field's value, only if provided value is
		* less/greater than current value. To work on arrays, you have `$push`, `$pop`, `$addToSet`, `$pull`, and the special
		* `$each` and `$slice`.
		* @param {Object} [options = {}] Optional options
		* @param {boolean} [options.multi = false] If true, can update multiple documents
		* @param {boolean} [options.upsert = false] If true, can insert a new document corresponding to the `update` rules if
		* your `query` doesn't match anything. If your `update` is a simple object with no modifiers, it is the inserted
		* document. In the other case, the `query` is stripped from all operator recursively, and the `update` is applied to
		* it.
		* @param {boolean} [options.returnUpdatedDocs = false] (not Mongo-DB compatible) If true and update is not an upsert,
		* will return the array of documents matched by the find query and updated. Updated documents will be returned even
		* if the update did not actually modify them.
		* @return {Promise<{numAffected: number, affectedDocuments: document[]|document|null, upsert: boolean}>}
		* - `upsert` is `true` if and only if the update did insert a document, **cannot be true if `options.upsert !== true`**.
		* - `numAffected` is the number of documents affected by the update or insertion (if `options.multi` is `false` or `options.upsert` is `true`, cannot exceed `1`);
		* - `affectedDocuments` can be one of the following:
		*    - If `upsert` is `true`, the inserted document;
		*    - If `options.returnUpdatedDocs` is `false`, `null`;
		*    - If `options.returnUpdatedDocs` is `true`:
		*      - If `options.multi` is `false`, the updated document;
		*      - If `options.multi` is `true`, the array of updated documents.
		* @async
		*/
		updateAsync(query, update, options = {}) {
			return this.executor.pushAsync(() => this._updateAsync(query, update, options));
		}
		/**
		* @callback Datastore~removeCallback
		* @param {?Error} err
		* @param {?number} numRemoved
		*/
		/**
		* Internal version without using the {@link Datastore#executor} of {@link Datastore#removeAsync}, use it instead.
		*
		* @param {query} query
		* @param {object} [options]
		* @param {boolean} [options.multi = false]
		* @return {Promise<number>}
		* @private
		* @see Datastore#removeAsync
		*/
		async _removeAsync(query, options = {}) {
			const multi = options.multi !== void 0 ? options.multi : false;
			const candidates = await this._getCandidatesAsync(query, true);
			const removedDocs = [];
			let numRemoved = 0;
			candidates.forEach((d) => {
				if (model.match(d, query) && (multi || numRemoved === 0)) {
					numRemoved += 1;
					removedDocs.push({
						$$deleted: true,
						_id: d._id
					});
					this._removeFromIndexes(d);
				}
			});
			await this.persistence.persistNewStateAsync(removedDocs);
			return numRemoved;
		}
		/**
		* Callback version of {@link Datastore#removeAsync}.
		* @param {query} query
		* @param {object|Datastore~removeCallback} [options={}]
		* @param {boolean} [options.multi = false]
		* @param {Datastore~removeCallback} [cb = () => {}]
		* @see Datastore#removeAsync
		*/
		remove(query, options, cb) {
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			const callback = cb || (() => {});
			callbackify((query, options) => this.removeAsync(query, options))(query, options, callback);
		}
		/**
		* Remove all docs matching the query.
		* @param {query} query MongoDB-style query
		* @param {object} [options={}] Optional options
		* @param {boolean} [options.multi = false] If true, can update multiple documents
		* @return {Promise<number>} How many documents were removed
		* @async
		*/
		removeAsync(query, options = {}) {
			return this.executor.pushAsync(() => this._removeAsync(query, options));
		}
	};
	module.exports = Datastore;
}));
//#endregion
//#region node_modules/@seald-io/nedb/index.js
var require_nedb = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_datastore();
}));
//#endregion
//#region node_modules/nedb-promises/src/Cursor.js
var require_Cursor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var OriginalCursor = require_cursor();
	/**
	* @class
	*/
	var Cursor = class {
		constructor(datastore, op, ...args) {
			const cursor = datastore.__original[op](...args);
			if (!(cursor instanceof OriginalCursor)) throw new TypeError(`Unexpected ${typeof original}, expected: Cursor (nedb/lib/cursor)`);
			Object.defineProperties(this, {
				__original: {
					configurable: false,
					enumerable: false,
					writable: false,
					value: cursor
				},
				__datastore: {
					configurable: false,
					enumerable: false,
					writable: false,
					value: datastore
				},
				__op: {
					configurable: false,
					enumerable: false,
					writable: false,
					value: op
				},
				__args: {
					configurable: false,
					enumerable: false,
					writable: false,
					value: args
				}
			});
		}
		/**
		* Sort the queried documents.
		*
		* See: https://github.com/louischatriot/nedb#sorting-and-paginating
		* 
		* @return {Cursor}
		*/
		sort(...args) {
			this.__original.sort(...args);
			return this;
		}
		/**
		* Skip some of the queried documents.
		*
		* See: https://github.com/louischatriot/nedb#sorting-and-paginating
		* 
		* @return {Cursor}
		*/
		skip(...args) {
			this.__original.skip(...args);
			return this;
		}
		/**
		* Limit the queried documents.
		*
		* See: https://github.com/louischatriot/nedb#sorting-and-paginating
		* 
		* @return {Cursor}
		*/
		limit(...args) {
			this.__original.limit(...args);
			return this;
		}
		/**
		* Set the document projection.
		* 
		* See: https://github.com/louischatriot/nedb#projections
		* 
		* @return {Cursor}
		*/
		project(...args) {
			this.__original.projection(...args);
			return this;
		}
		/**
		* Execute the cursor.
		*
		* Since the Cursor has a `then` and a `catch` method
		* JavaScript identifies it as a thenable object
		* thus you can await it in async functions.
		*
		* @example
		* // in an async function
		* await datastore.find(...)
		*  .sort(...)
		*  .limit(...)
		*
		* @example
		* // the previous is the same as:
		* await datastore.find(...)
		*  .sort(...)
		*  .limit(...)
		*  .exec()
		* 
		* @return {Promise<Object[]>}
		*/
		async exec() {
			await this.__datastore.load();
			try {
				const result = await this.__original.execAsync();
				this.__datastore.broadcastSuccess(this.__op, result, ...this.__args);
				return result;
			} catch (error) {
				this.__datastore.broadcastError(this.__op, error, ...this.__args);
				throw error;
			}
		}
		/**
		* Execute the cursor and set promise callbacks.
		* 
		* For more information visit:
		* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
		* 
		* @param  {Function} fulfilled
		* @param  {Function} [rejected]
		* @return {Promise}
		*/
		then(fulfilled, rejected) {
			return this.exec().then(fulfilled, rejected);
		}
		/**
		* Execute the cursor and set promise error callback.
		*
		* For more information visit:
		* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
		* 
		* @param  {Function} rejected
		* @return {Promise}
		*/
		catch(rejected) {
			return this.exec().catch(rejected);
		}
	};
	module.exports = Cursor;
}));
//#endregion
//#region node_modules/nedb-promises/src/Datastore.js
var require_Datastore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter = require("events");
	var OriginalDatastore = require_nedb();
	var Cursor = require_Cursor();
	/**
	* @summary
	* As of v2.0.0 the Datastore class extends node's built 
	* in EventEmitter class and implements each method as an event
	* plus additional error events. It also inherits the `compaction.done`
	* event from nedb but for consistency, in this library the event
	* was renamed to `compactionDone`.
	*
	* All event callbacks will be passed the same type of values,
	* the first being the datastore, then the operation result (if there is any)
	* and then the arguments of the called method. (Check out the first example!)
	*
	* All events have a matching error event that goes by the name of `${method}Error`,
	* for example `findError` or `loadError`. The callbacks of these events will receive
	* the same parameters as the normal event handlers except that instead of the 
	* operation result there will be an operation error. (Check out the second example!)
	*
	* A generic `__error__` event is also available. This event will be emitted at any of
	* the above error events. The callbacks of this event will receive the same parameters
	* as the specific error event handlers except that there will be one more parameter 
	* passed between the datastore and the error object, that being the name of the method
	* that failed. (Check out the third example!)
	*
	* @example
	* let datastore = Datastore.create()
	* datastore.on('update', (datastore, result, query, update, options) => {
	* })
	* datastore.on('load', (datastore) => {
	*     // this event doesn't have a result
	* })
	* datastore.on('ensureIndex', (datastore, options) => {
	*     // this event doesn't have a result
	*     // but it has the options argument which will be passed to the
	*     // event handlers
	* })
	* datastore.on('compactionDone', (datastore) => {
	*     // inherited from nedb's compaction.done event
	* })
	*
	* @example
	* let datastore = Datastore.create()
	* datastore.on('updateError', (datastore, error, query, update, options) => {
	* })
	* datastore.on('loadError', (datastore, error) => {
	* })
	* datastore.on('ensureIndexError', (datastore, error, options) => {
	* })
	*
	* @example
	* let datastore = Datastore.create()
	* datastore.on('__error__', (datastore, event, error, ...args) => {
	*     // for example
	*     // datastore, 'find', error, [{ foo: 'bar' }, {}]
	* })
	* 
	* @class
	*/
	var Datastore = class extends EventEmitter {
		/**
		* Create a database instance.
		*
		* Use this over `new Datastore(...)` to access
		* original nedb datastore properties, such as
		* `datastore.persistence`.
		*
		* Note that this method only creates the `Datastore`
		* class instance, not the datastore file itself.
		* The file will only be created once an operation
		* is issued against the datastore or if you call
		* the `load` instance method explicitly.
		* 
		* The path (if specified) will be relative to `process.cwd()`
		* (unless an absolute path was passed).
		*
		* For more information visit:
		* https://github.com/louischatriot/nedb#creatingloading-a-database
		* 
		* @param  {string|Object} [pathOrOptions]
		* @return {Proxy<static>}
		*/
		static create(pathOrOptions) {
			return new Proxy(new this(pathOrOptions), {
				get(target, key) {
					return target[key] ? target[key] : target.__original[key];
				},
				set(target, key, value) {
					return Object.prototype.hasOwnProperty.call(target.__original, key) ? target.__original[key] = value : target[key] = value;
				}
			});
		}
		/**
		* Datastore constructor...
		*
		* You should use `Datastore.create(...)` instead
		* of `new Datastore(...)`. With that you can access
		* the original datastore's properties such as `datastore.persistence`.
		*
		* Create a Datastore instance.
		* 
		* Note that the datastore will be created
		* relative to `process.cwd()`
		* (unless an absolute path was passed).
		* 
		* It's basically the same as the original:
		* https://github.com/louischatriot/nedb#creatingloading-a-database
		* 
		* @param  {string|Object} [pathOrOptions]
		* @return {static}
		*/
		constructor(pathOrOptions) {
			super();
			const datastore = new OriginalDatastore(typeof pathOrOptions === "string" ? { filename: pathOrOptions } : pathOrOptions);
			Object.defineProperties(this, {
				__loaded: {
					enumerable: false,
					writable: true,
					value: null
				},
				__original: {
					configurable: true,
					enumerable: false,
					writable: false,
					value: datastore
				}
			});
			this.__original.on("compaction.done", () => {
				this.emit("compactionDone", this);
			});
		}
		/**
		* Load the datastore.
		*
		* Note that you don't necessarily have to call
		* this method to load the datastore as it will
		* automatically be called and awaited on any
		* operation issued against the datastore
		* (i.e.: `find`, `findOne`, etc.).
		* 
		* @return {Promise<undefined>}
		*/
		load() {
			if (!(this.__loaded instanceof Promise)) this.__loaded = this.__original.loadDatabaseAsync().then(() => this.broadcastSuccess("load")).catch((error) => {
				this.broadcastError("load", error);
				throw error;
			});
			return this.__loaded;
		}
		/**
		* Find documents that match the specified `query`.
		*
		* It's basically the same as the original:
		* https://github.com/louischatriot/nedb#finding-documents
		*
		* There are differences minor in how the cursor works though.
		*
		* @example
		* datastore.find({ ... }).sort({ ... }).exec().then(...)
		*
		* @example
		* datastore.find({ ... }).sort({ ... }).then(...)
		*
		* @example
		* // in an async function
		* await datastore.find({ ... }).sort({ ... })
		* 
		* @param  {Object} [query]
		* @param  {Object} [projection]
		* @return {Cursor}
		*/
		find(query = {}, projection) {
			if (typeof projection === "function") projection = {};
			return new Cursor(this, "find", query, projection);
		}
		/**
		* Find a document that matches the specified `query`.
		*
		* It's basically the same as the original:
		* https://github.com/louischatriot/nedb#finding-documents
		*
		* @example
		* datastore.findOne({ ... }).then(...)
		*
		* @example
		* // in an async function
		* await datastore.findOne({ ... }).sort({ ... })
		* 
		* @param  {Object} [query]
		* @param  {Object} [projection]
		* @return {Cursor}
		*/
		findOne(query = {}, projection) {
			if (typeof projection === "function") projection = {};
			return new Cursor(this, "findOne", query, projection);
		}
		/**
		* Insert a document or documents.
		*
		* It's basically the same as the original:
		* https://github.com/louischatriot/nedb#inserting-documents
		* 
		* @param  {Object|Object[]} docs
		* @return {Promise<Object|Object[]>}
		*/
		async insert(docs) {
			await this.load();
			try {
				const result = await this.__original.insertAsync(docs);
				this.broadcastSuccess("insert", docs);
				return result;
			} catch (error) {
				this.broadcastError("insert", error, docs);
				throw error;
			}
		}
		/**
		* Insert a single document.
		*
		* This is just an alias for `insert` with object destructuring
		* to ensure a single document.
		* 
		* @param  {Object} doc
		* @return {Promise<Object>}
		*/
		insertOne({ ...doc }) {
			return this.insert(doc);
		}
		/**
		* Insert multiple documents.
		*
		* This is just an alias for `insert` with array destructuring
		* to ensure multiple documents.
		* 
		* @param  {Object[]} docs
		* @return {Promise<Object[]>}
		*/
		insertMany([ ...docs]) {
			return this.insert(docs);
		}
		/**
		* Update documents that match the specified `query`.
		*
		* It's basically the same as the original:
		* https://github.com/louischatriot/nedb#updating-documents
		*
		* If you set `options.returnUpdatedDocs`,
		* the returned promise will resolve with
		* an object (if `options.multi` is `false`) or
		* with an array of objects.
		* 
		* @param  {Object} query
		* @param  {Object} update
		* @param  {Object} [options]
		* @return {Promise<number|Object|Object[]>}
		*/
		async update(query, update, options = {}) {
			await this.load();
			try {
				const { numAffected, affectedDocuments } = await this.__original.updateAsync(query, update, options);
				const result = options.returnUpdatedDocs ? affectedDocuments : numAffected;
				this.broadcastSuccess("update", result, query, update, options);
				return result;
			} catch (error) {
				this.broadcastError("update", error, query, update, options);
				throw error;
			}
		}
		/**
		* Update a single document that matches the specified `query`.
		*
		* This is just an alias for `update` with `options.multi` set to `false`.
		* 
		* @param  {Object} query
		* @param  {Object} update
		* @param  {Object} [options]
		* 
		* @return {Promise<number|Object>}
		*/
		updateOne(query, update, options = {}) {
			return this.update(query, update, {
				...options,
				multi: false
			});
		}
		/**
		* Update multiple documents that match the specified `query`.
		*
		* This is just an alias for `update` with `options.multi` set to `true`.
		*
		* @param  {Object} query
		* @param  {Object} update
		* @param  {Object} [options]
		* 
		* @return {Promise<number|Object[]>}
		*/
		updateMany(query, update, options = {}) {
			return this.update(query, update, {
				...options,
				multi: true
			});
		}
		/**
		* Remove documents that match the specified `query`.
		*
		* It's basically the same as the original:
		* https://github.com/louischatriot/nedb#removing-documents
		* 
		* @param  {Object} [query]
		* @param  {Object} [options]
		* @return {Promise<number>}
		*/
		async remove(query = {}, options = {}) {
			await this.load();
			try {
				const result = await this.__original.removeAsync(query, options);
				this.broadcastSuccess("remove", result, query, options);
				return result;
			} catch (error) {
				this.broadcastError("remove", error, query, options);
				throw error;
			}
		}
		/**
		* Remove the first document that matches the specified `query`.
		*
		* This is just an alias for `remove` with `options.multi` set to `false`.
		* 
		* @param  {Object} [query]
		* @param  {Object} [options]
		* 
		* @return {Promise<number>}
		*/
		removeOne(query, options = {}) {
			return this.remove(query, {
				...options,
				multi: false
			});
		}
		/**
		* Remove all documents that match the specified `query`.
		*
		* This is just an alias for `remove` with `options.multi` set to `true`.
		* 
		* @param  {Object} [query]
		* @param  {Object} [options]
		* 
		* @return {Promise<number>}
		*/
		removeMany(query, options = {}) {
			return this.remove(query, {
				...options,
				multi: true
			});
		}
		/**
		* Remove the first document that matches the specified `query`.
		*
		* This is just an alias for `removeOne`.
		* 
		* @param  {Object} [query]
		* @param  {Object} [options]
		* 
		* @return {Promise<number>}
		*/
		deleteOne(query, options) {
			return this.removeOne(query, options);
		}
		/**
		* Remove all documents that match the specified `query`.
		*
		* This is just an alias for `removeMany`.
		* 
		* @param  {Object} [query]
		* @param  {Object} [options]
		* 
		* @return {Promise<number>}
		*/
		deleteMany(query, options) {
			return this.removeMany(query, options);
		}
		/**
		* Count documents matching the specified `query`.
		*
		* It's basically the same as the original:
		* https://github.com/louischatriot/nedb#counting-documents
		*
		* @example
		* datastore.count({ ... }).limit(...).then(...)
		*
		* @example
		* // in an async function
		* await datastore.count({ ... })
		* // or
		* await datastore.count({ ... }).sort(...).limit(...)
		* 
		* @param  {Object} [query]
		* @return {Cursor}
		*/
		count(query = {}) {
			return new Cursor(this, "count", query);
		}
		/**
		* https://github.com/louischatriot/nedb#indexing
		* 
		* @param  {Object} options
		* @return {Promise<undefined>}
		*/
		async ensureIndex(options) {
			try {
				const result = await this.__original.ensureIndexAsync(options);
				this.broadcastSuccess("ensureIndex", result, options);
				return result;
			} catch (error) {
				this.broadcastError("ensureIndex", error, options);
				throw error;
			}
		}
		/**
		* https://github.com/louischatriot/nedb#indexing
		* 
		* @param  {string} field
		* @return {Promise<undefined>}
		*/
		async removeIndex(field) {
			try {
				const result = await this.__original.removeIndexAsync(field);
				this.broadcastSuccess("removeIndex", result, field);
				return result;
			} catch (error) {
				this.broadcastError("removeIndex", error, field);
				throw error;
			}
		}
		/**
		* Broadcasts operation success messages.
		* 
		* @param  {string} op
		* @param  {*}      result
		* @param  {...*}   args
		* 
		* @return {undefined}
		* @private
		*/
		broadcastSuccess(op, result, ...args) {
			this.emit(op, this, result, ...args);
			return this;
		}
		/**
		* Broadcasts operation error messages.
		* 
		* @param  {string} op
		* @param  {Error}  error
		* @param  {...*}   args
		* 
		* @return {undefined}
		* @private
		*/
		broadcastError(op, error, ...args) {
			this.emit(`${op}Error`, this, error, ...args);
			this.emit("__error__", this, op, error, ...args);
			return this;
		}
	};
	module.exports = Datastore;
}));
//#endregion
//#region core/services/db.service_old.ts
var import_nedb_promises = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_Datastore();
})))(), 1);
var DbService = class {
	db = null;
	async initDb() {
		if (this.db) return this.db;
		const dbPath = path.default.join(electron.app.getPath("userData"), "mat_ai_memory.db");
		this.db = import_nedb_promises.default.create({
			filename: dbPath,
			autoload: true
		});
		return this.db;
	}
	async saveMessage(role, content) {
		return await (await this.initDb()).insert({
			role,
			content,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
	}
	async getHistory(limit = 15) {
		const history = await (await this.initDb()).find({}).sort({ timestamp: -1 }).limit(limit);
		return Array.isArray(history) ? history.reverse() : [];
	}
};
var dbService = new DbService();
var getHistory = (limit = 15) => dbService.getHistory(limit);
//#endregion
//#region electron/ipc/ai.ipc.ts
function toUint8Array(payload) {
	if (payload instanceof Uint8Array) return payload;
	if (payload instanceof ArrayBuffer) return new Uint8Array(payload);
	if (ArrayBuffer.isView(payload)) return new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength);
	return null;
}
function isWhisperVoiceConfigured() {
	return Boolean(process.env["OPENAI_API_KEY"]?.trim());
}
function registerAiIpc() {
	console.log("🔥 MAT.AI BACKEND: Fungsi registerAiIpc() BERJAYA DIJALANKAN!");
	electron.ipcMain.handle("mat-ai:voice-capabilities", () => ({ whisper: isWhisperVoiceConfigured() }));
	electron.ipcMain.handle("mat-ai:transcribe", async (_event, payload) => {
		const bytes = toUint8Array(payload);
		if (!bytes) return {
			ok: false,
			error: "Invalid audio payload."
		};
		try {
			const text = await transcribeAudioBuffer(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength));
			if (text.startsWith("[RALAT SUARA]:")) return {
				ok: false,
				error: text
			};
			return {
				ok: true,
				text
			};
		} catch (err) {
			return {
				ok: false,
				error: err instanceof Error ? err.message : String(err)
			};
		}
	});
	electron.ipcMain.handle("mat-ai:chat", async (_event, { userText, uiSelection, inputMode, localModelName = "llama3.1:8b", attachment }) => {
		const trimmed = typeof userText === "string" ? userText.trim() : "";
		if (!trimmed && !attachment) return {
			ok: false,
			error: "Mesej kosong, Boss."
		};
		try {
			console.log(`📥 [IPC AI]: Mesej Masuk -> Mod: ${uiSelection} | Model: ${localModelName} | Input: ${inputMode} | Attachment: ${attachment ? attachment.name : "Tiada"}`);
			const ayatPenuhAI = await matAiRouter(trimmed, uiSelection, _event, localModelName, attachment);
			const shouldSpeak = inputMode === "voice";
			if (shouldSpeak) {
				console.log("🎙️ [VOICE DETECTED]: Input dari suara. Memicu enjin Kokoro lokal...");
				speakText(ayatPenuhAI);
			} else console.log("⌨️ [TEXT DETECTED]: User menaip/hantar gambar. Menyekat suara robot, Puck diam.");
			return {
				ok: true,
				text: ayatPenuhAI,
				shouldSpeak
			};
		} catch (err) {
			const ralatSebenar = err instanceof Error ? err.message : String(err);
			console.error("❌ [MAIN PROCESS CRASH]:", err);
			return {
				ok: false,
				error: `Otak MAT.ai Sangkut: ${ralatSebenar}`
			};
		}
	});
	electron.ipcMain.handle("mat-ai:get-history", async (_event, limit = 15) => {
		try {
			const rows = await getHistory(limit);
			return {
				ok: true,
				history: (Array.isArray(rows) ? rows : []).map((row) => ({
					role: row.role,
					content: row.content
				}))
			};
		} catch (err) {
			return {
				ok: false,
				error: err instanceof Error ? err.message : String(err)
			};
		}
	});
}
//#endregion
//#region electron/ipc/system.ipc.ts
function executeCommand(action) {
	return new Promise((resolve, reject) => {
		let command;
		switch (action) {
			case "open_vscode":
				command = "code .";
				break;
			case "open_browser":
				command = "start chrome";
				break;
			case "calculator":
				command = "calc";
				break;
			case "open_youtube":
				command = "start https://www.youtube.com";
				break;
			default:
				reject(/* @__PURE__ */ new Error(`Unknown action: ${action}`));
				return;
		}
		(0, node_child_process.exec)(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout || stderr || `Command "${action}" executed successfully`);
		});
	});
}
function registerSystemIpc() {
	electron.ipcMain.handle("mat-ai:execute-command", async (_event, action) => {
		try {
			return {
				ok: true,
				message: await executeCommand(action)
			};
		} catch (err) {
			return {
				ok: false,
				error: err instanceof Error ? err.message : String(err)
			};
		}
	});
}
electron.ipcMain.handle("mat-ai:select-file", async () => {
	console.log("🎯 MAT.AI BACKEND: Channel 'mat-ai:select-file' BERJAYA DIKETUK!");
	try {
		const result = await electron.dialog.showOpenDialog({
			title: "Pilih gambar atau fail untuk MAT.ai",
			properties: ["openFile"],
			filters: [
				{
					name: "Semua Fail",
					extensions: [
						"png",
						"jpg",
						"jpeg",
						"txt",
						"pdf",
						"md",
						"json"
					]
				},
				{
					name: "Gambar",
					extensions: [
						"png",
						"jpg",
						"jpeg"
					]
				},
				{
					name: "Dokumen teks",
					extensions: [
						"txt",
						"md",
						"json"
					]
				}
			]
		});
		if (result.canceled || result.filePaths.length === 0) return {
			ok: false,
			reason: "user_cancelled"
		};
		const filePath = result.filePaths[0];
		const fileName = node_path.basename(filePath);
		const ext = node_path.extname(filePath).toLowerCase();
		if ([
			".png",
			".jpg",
			".jpeg"
		].includes(ext)) {
			const base64Data = node_fs.readFileSync(filePath).toString("base64");
			return {
				ok: true,
				type: "image",
				path: filePath,
				name: fileName,
				data: `data:${ext === ".png" ? "image/png" : "image/jpeg"};base64,${base64Data}`
			};
		}
		if ([
			".txt",
			".md",
			".json"
		].includes(ext)) return {
			ok: true,
			type: "text_file",
			path: filePath,
			name: fileName,
			content: node_fs.readFileSync(filePath, "utf-8")
		};
		return {
			ok: true,
			type: "other",
			path: filePath,
			name: fileName
		};
	} catch (error) {
		console.error("Gagal buka file dialog:", error);
		return {
			ok: false,
			error: error.message
		};
	}
});
//#endregion
//#region electron/main.ts
import_main.default.config({ path: node_path.default.join(process.cwd(), ".env") });
function registerMatAiSessionPermissions() {
	electron.session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
		if (permission === "media") {
			callback(true);
			return;
		}
		callback(false);
	});
}
async function ensureMicrophoneAccessIfNeeded() {
	if (process.platform !== "darwin") return;
	try {
		if (electron.systemPreferences.getMediaAccessStatus("microphone") === "not-determined") await electron.systemPreferences.askForMediaAccess("microphone");
	} catch {}
}
http.default.createServer((req, res) => {
	if (req.method === "POST" && req.url === "/api/wakeup") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			console.log("🚀🎉 [ELECTRON RECV]: PYTHON KETUK PINTU! Tuan panggil Mat AI!");
			const mainWindow = electron.BrowserWindow.getAllWindows()[0];
			if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("mat-ai:wakeup-triggered");
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Telinga lintah diterima mat!" }));
		});
	} else {
		res.writeHead(404);
		res.end();
	}
}).listen(3e3, "127.0.0.1", () => {
	console.log("📡 [ELECTRON NET]: Jambatan HTTP port 3000 sedia menunggu isyarat Python...");
});
var pythonProcess = null;
function startKokoroVoiceServer() {
	const projectRoot = process.cwd();
	const pythonExecutable = node_path.default.join(projectRoot, "core", "voice", "kokoro-backend", ".venv", "Scripts", "python.exe");
	const scriptPath = node_path.default.join(projectRoot, "core", "voice", "kokoro-backend", "api_server.py");
	console.log(`🚀 [MAT.AI LAUNCHER]: Menyemak enjin suara di: ${scriptPath}`);
	if (!fs.default.existsSync(pythonExecutable)) {
		console.error("❌ [LAUNCHER ERROR]: Fail python.exe dalam venv tak jumpa mat! Jgn risau, check path betul-betul.");
		return;
	}
	console.log("🔥 [MAT.AI LAUNCHER]: Menghidupkan enjin suara Kokoro secara senyap...");
	pythonProcess = (0, child_process.spawn)(pythonExecutable, [scriptPath], {
		cwd: node_path.default.dirname(scriptPath),
		env: {
			...process.env,
			PYTHONIOENCODING: "utf-8"
		}
	});
	pythonProcess.stdout.on("data", (data) => {
		console.log(`🐍 [PYTHON LOG]: ${data.toString().trim()}`);
	});
	pythonProcess.stderr.on("data", (data) => {
		console.error(`⚠️ [PYTHON WARN/LOG]: ${data.toString().trim()}`);
	});
}
electron.ipcMain.handle("mat-ai:cakap", async (_event, teksJawapan) => {
	console.log(`🤖 [ELECTRON MAIN]: Dapat arahan sebut -> "${teksJawapan}"`);
	try {
		const pathAudioWav = await janaSuaraMatAi(teksJawapan);
		if (pathAudioWav) {
			mainkanAudioLokal(pathAudioWav);
			return { success: true };
		}
		return {
			success: false,
			error: "Gagal jana fail audio wav."
		};
	} catch (error) {
		console.error(`❌ [IPC CAKAP ERROR]: ${error.message}`);
		return {
			success: false,
			error: error.message
		};
	}
});
electron.app.whenReady().then(async () => {
	await ensureMicrophoneAccessIfNeeded();
	registerMatAiSessionPermissions();
	startKokoroVoiceServer();
	registerAiIpc();
	registerSystemIpc();
	createWindow();
	setTimeout(() => {
		const mainWindow = electron.BrowserWindow.getAllWindows()[0];
		if (mainWindow) {
			console.log("🔥 [MAIN BOOT]: Mengejutkan telinga lintah KWS buat kali pertama...");
			startLocalWakeupWord(mainWindow);
		}
	}, 1500);
});
electron.ipcMain.on("mat-ai:start-kws", () => {
	const mainWindow = electron.BrowserWindow.getAllWindows()[0];
	if (mainWindow) startLocalWakeupWord(mainWindow);
	else console.warn("⚠️ [MAIN]: Gagal start KWS sebab mainWindow belum wujud mat!");
});
electron.ipcMain.on("mat-ai:stop-kws", () => {});
electron.ipcMain.on("mat-ai:wakeup-triggered", () => {
	console.log("🤖 [MAIN LOOP]: Mat AI tengah layan arahan kau... Telinga lintah rehat kejap.");
	setTimeout(() => {
		const mainWindow = electron.BrowserWindow.getAllWindows()[0];
		if (mainWindow) {
			console.log("♻️ [MAIN LOOP]: Menghidupkan semula telinga lintah KWS secara automatik...");
			startLocalWakeupWord(mainWindow);
		}
	}, 5e3);
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("activate", () => {
	if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
electron.app.on("will-quit", () => {
	if (pythonProcess) {
		console.log("🛑 [MAT.AI LAUNCHER]: Mematikan enjin suara Kokoro...");
		if (process.platform === "win32") (0, child_process.exec)(`taskkill /pid ${pythonProcess.pid} /f /t`);
		else pythonProcess.kill("SIGTERM");
	}
});
//#endregion
