import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(/* html */`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Omni Cosmos - Full 1st Magnitude Stars & Cosmic Web</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; overflow: hidden; background-color: #000; font-family: 'Inter', sans-serif; color: white; touch-action: none; }
        canvas { display: block; }
        .overlay { position: absolute; pointer-events: none; text-shadow: 0 0 10px rgba(0,0,0,0.9); }
        .interactive { pointer-events: auto; }
        #ui-top-left { top: 30px; left: 30px; }
        .view-switcher { top: 30px; right: 30px; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; max-width: 900px; }

        .control-panel { bottom: 30px; right: 30px; background: rgba(0, 5, 15, 0.9); padding: 20px; border-radius: 16px; border: 1px solid rgba(100, 180, 255, 0.3); width: 440px; max-height: 80vh; overflow-y: auto; backdrop-filter: blur(15px); transition: all 0.4s ease; }

        #toggle-panel-btn { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.1); border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: 0.2s; pointer-events: auto; z-index: 50; }
        #toggle-panel-btn:hover { background: #ef4444; }

        #restore-panel-btn { position: absolute; bottom: 30px; right: 30px; background: rgba(99, 102, 241, 0.9); color: white; padding: 10px 20px; border-radius: 30px; cursor: pointer; font-size: 12px; font-weight: bold; display: none; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.5); pointer-events: auto; }

        #info-panel { top: 150px; right: 30px; background: rgba(0, 10, 30, 0.95); padding: 25px; border-radius: 12px; border-left: 4px solid #6366f1; width: 340px; display: none; backdrop-filter: blur(20px); z-index: 100; border-top: 1px solid rgba(255,255,255,0.1); }

        button.celestial-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: #ccc; padding: 4px 8px; border-radius: 4px; cursor: pointer; transition: 0.2s; font-size: 9px; font-weight: 600; text-transform: uppercase; pointer-events: auto; white-space: nowrap; }
        button.celestial-btn:hover, button.celestial-btn.active { background: rgba(99, 102, 241, 0.4); color: white; border-color: rgba(99, 102, 241, 0.6); }

        .category-label { font-size: 9px; font-weight: 900; color: #818cf8; text-transform: uppercase; margin-top: 12px; margin-bottom: 4px; grid-column: span 4; border-bottom: 1px solid rgba(129, 140, 248, 0.2); padding-bottom: 2px; }

        .celestial-label { position: absolute; color: white; padding: 2px 6px; background: rgba(0, 0, 0, 0.6); border-radius: 3px; font-size: 10px; font-weight: bold; pointer-events: none; white-space: nowrap; transform: translate(-50%, -150%); transition: opacity 0.3s; border: 1px solid rgba(255,255,255,0.1); }

        .switch { position: relative; display: inline-block; width: 34px; height: 18px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #6366f1; }
        input:checked + .slider:before { transform: translateX(16px); }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.5); }

        @media (max-width: 640px) {
            .view-switcher { justify-content: flex-start; max-width: 100%; top: 80px; left: 15px; right: 15px; }
            .control-panel { width: calc(100% - 60px); left: 30px; bottom: 20px; }
            #info-panel { width: calc(100% - 60px); left: 30px; top: auto; bottom: 200px; }
            #ui-top-left h1 { font-size: 1.5rem; }
        }
    </style>
</head>
<body>

    <div id="ui-top-left" class="overlay">
        <h1 class="text-4xl font-black tracking-tighter italic text-indigo-400">OMNI COSMOS</h1>
        <p class="text-[12px] uppercase tracking-[0.3em] text-indigo-200/60 font-bold">Ultra Expanded Scale Edition</p>
    </div>

    <div id="labels-container" class="overlay w-full h-full"></div>

    <div class="overlay view-switcher interactive">
        <button class="celestial-btn" onclick="switchCategory('solar')" id="btn-solar">太陽系</button>
        <button class="celestial-btn" onclick="switchCategory('dwarfs')" id="btn-dwarfs">準惑星</button>
        <button class="celestial-btn" onclick="switchCategory('asteroids')" id="btn-asteroids">小惑星</button>
        <button class="celestial-btn" onclick="switchCategory('tnos')" id="btn-tnos">地球外縁天体</button>
        <button class="celestial-btn" onclick="switchCategory('comets')" id="btn-comets">彗星</button>
        <button class="celestial-btn" onclick="switchCategory('satellites')" id="btn-satellites">衛星</button>
        <button class="celestial-btn" onclick="switchCategory('stars')" id="btn-stars">恒星カタログ</button>
        <button class="celestial-btn" onclick="switchCategory('milkyway')" id="btn-milkyway">銀河系詳細</button>
        <button class="celestial-btn" onclick="switchCategory('galaxies')" id="btn-galaxies">単独銀河</button>
        <button class="celestial-btn" onclick="switchCategory('clusters')" id="btn-clusters">銀河群・団</button>
        <button class="celestial-btn" onclick="switchCategory('superclusters')" id="btn-superclusters">超銀河団</button>
        <button class="celestial-btn" onclick="switchCategory('cosmic')" id="btn-cosmic">大規模構造</button>
        <button class="celestial-btn" onclick="switchCategory('others')" id="btn-others">その他</button>
    </div>

    <div id="info-panel" class="overlay interactive">
        <h2 id="info-name" class="text-3xl font-black text-white"></h2>
        <p id="info-meta" class="text-[12px] font-bold text-indigo-400 mb-2 uppercase"></p>
        <div id="info-desc" class="text-sm leading-relaxed text-gray-300 border-t border-white/10 pt-3 mb-4"></div>
        <button onclick="document.getElementById('info-panel').style.display='none'" class="celestial-btn w-full py-2 bg-white/10 hover:bg-indigo-600 rounded-md transition-all">閉じる</button>
    </div>

    <button id="restore-panel-btn" onclick="toggleControlPanel(false)">設定・一覧を表示</button>

    <div id="main-control-panel" class="control-panel overlay interactive">
        <button id="toggle-panel-btn" onclick="toggleControlPanel(true)" title="閉じる">✕</button>

        <div class="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
            <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-200">軌道表示</span>
                <label class="switch">
                    <input type="checkbox" id="toggle-orbit" checked onchange="updateVisibilitySettings()">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-200">ラベル表示</span>
                <label class="switch">
                    <input type="checkbox" id="toggle-label" checked onchange="updateVisibilitySettings()">
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div id="target-buttons" class="grid grid-cols-4 gap-1"></div>

        <div class="pt-4 mt-4 border-t border-white/10">
            <div class="flex justify-between text-[11px] font-black text-indigo-300 uppercase mb-2">
                <span>時間加速 (Time Scale)</span>
                <span id="speed-val">1.0x</span>
            </div>
            <input type="range" id="speed-slider" min="0" max="100" step="0.1" value="1" class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 pointer-events-auto">
        </div>
    </div>

    <script>
        let scene, camera, renderer;
        let mainGroup, orbitGroup, cosmicGroup, asteroidBeltGroup;
        let celestialObjects = [];
        let simulationSpeed = 0.01;

        let showOrbits = true;
        let showLabels = true;

        let trackingTarget = null;
        let targetLookAt = new THREE.Vector3(0, 0, 0);
        let currentLookAt = new THREE.Vector3(0, 0, 0);
        let zoomDistance = 10000;
        let cameraOffset = new THREE.Vector3(1, 0.4, 1.2).normalize();

        const DATA = {
            solar: [
                { name: "太陽", color: 0xFFDD44, size: 7500, dist: 0, speed: 0, meta: "恒星 (G2V)", desc: "太陽系の中心。全質量の99.8%を占める。", type: "sun" },
                { name: "水星", color: 0xAAAAAA, size: 400, dist: 39000, speed: 0.047, meta: "惑星", desc: "太陽に最も近い、クレーターだらけの惑星。", type: "rocky" },
                { name: "金星", color: 0xFFCC88, size: 700, dist: 57000, speed: 0.035, meta: "惑星", desc: "厚い硫酸の雲に覆われた灼熱の惑星。", type: "cloudy" },
                { name: "地球", color: 0x2266FF, size: 760, dist: 81000, speed: 0.029, meta: "惑星", desc: "生命が確認されている唯一の天体。", type: "earth" },
                { name: "火星", color: 0xFF5533, size: 560, dist: 108000, speed: 0.024, meta: "惑星", desc: "酸化鉄の影響で赤く見える惑星。", type: "rocky" },
                { name: "木星", color: 0xE6B18A, size: 2200, dist: 210000, speed: 0.013, meta: "ガス巨大惑星", desc: "太陽系最大の惑星。大赤斑がある。", type: "gas" },
                { name: "土星", color: 0xF2E1AC, size: 2000, dist: 288000, speed: 0.009, meta: "ガス巨大惑星", desc: "氷の粒子からなる美しい環を持つ。", type: "gas", hasRing: true, ringColor: 0xAD9F7B, ringInner: 1.4, ringOuter: 2.3 },
                { name: "天王星", color: 0xBBE1E4, size: 1200, dist: 372000, speed: 0.006, meta: "氷巨大惑星", desc: "自転軸がほぼ横倒しになっている。", type: "gas", hasRing: true, ringColor: 0x88AAAA, ringInner: 1.8, ringOuter: 1.9 },
                { name: "海王星", color: 0x4466FF, size: 1200, dist: 450000, speed: 0.005, meta: "氷巨大惑星", desc: "強風が吹き荒れる青い惑星。", type: "gas" }
            ],
            dwarfs: [
                { name: "冥王星", color: 0xDFCAB5, size: 300, dist: 570000, speed: 0.004, meta: "準惑星", desc: "カイパーベルト最大の天体。かつて第9惑星とされていた。", type: "rocky" },
                { name: "ケレス", color: 0x999999, size: 240, dist: 168000, speed: 0.017, meta: "準惑星", desc: "火星と木星の間の小惑星帯にある唯一の準惑星。", type: "rocky" },
                { name: "エリス", color: 0xEEEEEE, size: 300, dist: 780000, speed: 0.002, meta: "準惑星", desc: "冥王星と同程度の質量を持つ、散乱円盤天体の準惑星。", type: "rocky" },
                { name: "マケマケ", color: 0xCC8866, size: 220, dist: 660000, speed: 0.003, meta: "準惑星", desc: "イースター島の創造神にちなんで名付けられた氷の準惑星。", type: "rocky" },
                { name: "ハウメア", color: 0xFFFFFF, size: 200, dist: 630000, speed: 0.0035, meta: "準惑星", desc: "高速自転によりラグビーボールのように引き伸ばされた形状をしている。", type: "rocky" }
            ],
            asteroids: [
                { name: "ベスタ", color: 0xDDDDCC, size: 180, dist: 156000, speed: 0.019, meta: "小惑星", desc: "小惑星帯（メインベルト）で最も明るく見える岩石天体。", type: "rocky" },
                { name: "パラス", color: 0xAACCFF, size: 180, dist: 165000, speed: 0.018, meta: "小惑星", desc: "小惑星帯で3番目に大きい。軌道傾斜角が大きいのが特徴。", type: "rocky" },
                { name: "ヒギエア", color: 0x888888, size: 160, dist: 186000, speed: 0.016, meta: "小惑星", desc: "炭素質で黒っぽい、小惑星帯で4番目に大きい天体。", type: "rocky" },
                { name: "リュウグウ", color: 0x444444, size: 60, dist: 84000, speed: 0.028, meta: "地球近傍小惑星", desc: "「はやぶさ2」が探査を行ったC型小惑星。", type: "rocky" },
                { name: "イトカワ", color: 0xAAAA99, size: 40, dist: 90000, speed: 0.027, meta: "地球近傍小惑星", desc: "「はやぶさ」が探査を行ったS型小惑星。ラッコのような形。", type: "rocky" },
                { name: "ベンヌ", color: 0x555566, size: 60, dist: 87000, speed: 0.0275, meta: "地球近傍小惑星", desc: "OSIRIS-RExがサンプルリターンを行った小惑星。", type: "rocky" }
            ],
            tnos: [
                { name: "セドナ", color: 0xFF6644, size: 280, dist: 1800000, speed: 0.0005, meta: "分離天体", desc: "極めて遠方を公転する、赤みがかった謎多き天体。", type: "rocky" },
                { name: "ゴンゴン", color: 0xDD6666, size: 260, dist: 900000, speed: 0.0018, meta: "散乱円盤天体", desc: "2007 OR10としても知られる、赤色で大型の天体。", type: "rocky" },
                { name: "クワオアー", color: 0x887766, size: 240, dist: 690000, speed: 0.0028, meta: "キュビワノ族", desc: "真円に近い軌道を持つ大型のカイパーベルト天体。", type: "rocky" },
                { name: "オルクス", color: 0xAAAAAA, size: 220, dist: 564000, speed: 0.004, meta: "冥王星族", desc: "冥王星と似た軌道をもち、「アンチ・プルート」とも呼ばれる。", type: "rocky" }
            ],
            comets: [
                { name: "1P/ハレー", color: 0x00FFFF, size: 160, a: 240000, e: 0.967, i: 162, speed: 0.08, meta: "短周期彗星", desc: "約76年周期で回帰する最も有名な彗星。" },
                { name: "2P/エンケ", color: 0xCCFFCC, size: 120, a: 72000, e: 0.848, i: 11, speed: 0.15, meta: "短周期彗星", desc: "周期3.3年。おうし座流星群の母天体。" },
                { name: "67P/C-G", color: 0xAAAAAA, size: 140, a: 132000, e: 0.641, i: 7, speed: 0.1, meta: "短周期彗星", desc: "ロゼッタ探査機が着陸機フィラエを送り込んだ。" },
                { name: "153P/池谷・張", color: 0xCCFFFF, size: 180, a: 900000, e: 0.990, i: 28, speed: 0.03, meta: "長周期彗星", desc: "2002年に発見された明るい彗星。" },
                { name: "C/1995 O1", color: 0xFFFFFF, size: 240, a: 1500000, e: 0.995, i: 89, speed: 0.02, meta: "ヘール・ボップ彗星", desc: "1997年に肉眼で長期間観測された大彗星。" },
                { name: "マックノート C/2006 P1", color: 0xFFDD88, size: 200, a: 3000000, e: 0.9999, i: 77, speed: 0.015, meta: "非周期彗星", desc: "2007年に非常に明るくなり、壮大な尾を見せた大彗星。" },
                { name: "NEAT C/2001 Q4", color: 0x88FFDD, size: 150, a: 2800000, e: 0.9998, i: 99, speed: 0.018, meta: "非周期彗星", desc: "2004年に肉眼で見える明るさになった彗星。" }
            ],
            satellites: [
                { name: "ISS", parent: "地球", color: 0xFFFFFF, size: 100, dist: 1500, speed: 1.2, meta: "国際宇宙ステーション", desc: "高度約400kmを秒速約7.7kmで周回する有人宇宙施設。" }
            ],
            stars: [
                { name: "シリウス", color: 0xCCDDFF, size: 9000, pos: [-1200000, -300000, 1600000], meta: "おおいぬ座 α星", desc: "全天第1位の輝星。地球から約8.6光年. 白く輝く主系列星。" },
                { name: "カノープス", color: 0xFFFFEE, size: 18000, pos: [-2000000, -5000000, 3000000], meta: "りゅうこつ座 α星", desc: "全天第2位の輝星。南半球では極めて明るく見える。" },
                { name: "リギル・ケンタウルス", color: 0xFFFFEE, size: 8000, pos: [600000, -200000, -300000], meta: "ケンタウルス座 α星", desc: "全天第3位。太陽に最も近い恒星系の一つ（アルファ・ケンタウリ）。" },
                { name: "アークトゥルス", color: 0xFFCC88, size: 17000, pos: [2400000, 4000000, -1000000], meta: "うしかい座 α星", desc: "全天第4位。春の大三角形の一つ。オレンジ色の巨星。" },
                { name: "ベガ", color: 0xCCEEFF, size: 7000, pos: [1200000, 1000000, -1800000], meta: "こと座 α星", desc: "全天第5位。夏の大三角形の一つ。七夕の織姫星。" },
                { name: "カペラ", color: 0xFFFFCC, size: 14000, pos: [-1600000, 3000000, 2400000], meta: "ぎょしゃ座 α星", desc: "全天第6位。黄色の巨星。複数の星からなる連星系。" },
                { name: "リゲル", color: 0xBBCCFF, size: 11000, pos: [-2400000, -1200000, 3000000], meta: "オリオン座 β星", desc: "全天第7位。青白く輝く超巨星。オリオン座の足元に位置する。" },
                { name: "プロキオン", color: 0xFFFFEE, size: 8400, pos: [-700000, 240000, 1000000], meta: "こいぬ座 α星", desc: "全天第8位。冬の大三角形の一つ。" },
                { name: "ベテルギウス", color: 0xFF5500, size: 24000, pos: [-3000000, 1600000, 5000000], meta: "オリオン座 α星", desc: "全天第9位。赤色超巨星。変光星であり、超新星爆発が予期されている。" },
                { name: "アケルナル", color: 0xCCDDFF, size: 9600, pos: [1000000, -6000000, 4000000], meta: "エリダヌス座 α星", desc: "全天第10位。高速自転により極端に扁平な形をしているとされる。" },
                { name: "ハダル", color: 0xCCCCFF, size: 10400, pos: [2000000, -3000000, -4000000], meta: "ケンタウルス座 β星", desc: "全天第11位。青色の巨星。" },
                { name: "アクルックス", color: 0xCCDDEE, size: 9800, pos: [1600000, -7000000, -2000000], meta: "みなみじゅうじ座 α星", desc: "全天第12位。南十字星の最も明るい星。" },
                { name: "アルタイル", color: 0xCCEEFF, size: 6200, pos: [2400000, 300000, -800000], meta: "わし座 α星", desc: "全天第13位。夏の大三角形の一つ。七夕の彦星。" },
                { name: "アルデバラン", color: 0xFF9966, size: 15000, pos: [-3600000, 400000, 2000000], meta: "おうし座 α星", desc: "全天第14位。冬のダイヤモンドの一つ。オレンジ色の巨星。" },
                { name: "アンタレス", color: 0xFF4422, size: 22000, pos: [10000000, -2000000, 2000000], meta: "さそり座 α星", desc: "全天第15位。さそり座の心臓。巨大な赤色超巨星。" },
                { name: "スピカ", color: 0x99BBFF, size: 10000, pos: [5000000, -1000000, -2000000], meta: "おとめ座 α星", desc: "全天第16位。春の大三角形の一つ。青白く美しく輝く。" },
                { name: "ポルックス", color: 0xFFCC99, size: 8600, pos: [-1000000, 2400000, 3600000], meta: "ふたご座 β星", desc: "全天第17位。ふたご座の弟の星。オレンジ色の巨星。" },
                { name: "フォーマルハウト", color: 0xEEEEFF, size: 7600, pos: [8000000, -4000000, -6000000], meta: "みなみのうお座 α星", desc: "全天第18位。秋の夜空で孤光に輝く「南のひとつ星」。" },
                { name: "デネブ", color: 0xCCDDEE, size: 30000, pos: [2000000, 2800000, -4000000], meta: "はくちょう座 α星", desc: "全天第19位。夏の大三角形の一つ。非常に遠く、極めて明るい白鳥の尾。" },
                { name: "ミモザ", color: 0xCCDDFF, size: 10200, pos: [2400000, -6400000, -3000000], meta: "みなみじゅうじ座 β星", desc: "全天第20位。ベクルックスとも呼ばれる南十字星の星。" },
                { name: "レグルス", color: 0xCCDDFF, size: 8000, pos: [-4000000, 1600000, -1000000], meta: "しし座 α星", desc: "全天第21位。黄道上に位置する「ししの心臓」。" },
                { name: "りゅうこつ座η星", color: 0xFFAA88, size: 25000, pos: [-12000000, -15000000, 4000000], meta: "Eta Carinae", desc: "銀河系で最も重く不安定な恒星の一つ。周囲に人形星雲を持つ。" },
                { name: "V838 Mon", color: 0xFF3300, size: 28000, pos: [15000000, 2000000, 8000000], meta: "特異変光星", desc: "2002年に突如として輝きを増した謎の多い星。周囲に美しい「光のエコー」が見られる。" }
            ],
            milkyway: [
                { name: "銀河系(天の川銀河)", color: 0xFFFFFF, size: 1000000, pos: [0, 0, 0], meta: "我々の銀河", desc: "太陽系が含まれる棒渦巻銀河。約2000億個の星を含む。", isGalaxy: true },
                { name: "銀河系の中心領域", color: 0xFFCC44, size: 50000, pos: [0, 0, 0], meta: "いて座方向の中心部", desc: "ガスと塵の層の向こう側、星が極めて密集しSgr A*が潜む領域。", isGalaxy: true },
                { name: "南天の天の川", color: 0xCCEEFF, size: 300000, pos: [200000, -100000, 200000], meta: "ケンタウルス座〜十字座", desc: "星密度が最も高く見える天の川の太い部分。コールサック等の暗黒星雲も多い。", isGalaxy: true },
                { name: "銀河核 (Sgr A*)", color: 0xFFFFFF, size: 24000, pos: [0, 0, 0], meta: "超大質量ブラックホール", desc: "天の川銀河の中心にある、太陽の400万倍の質量を持つブラックホール周辺領域。", isGalaxy: true },
                { name: "銀河バルジ", color: 0xFFCC88, size: 160000, pos: [0, 0, 0], meta: "銀河核周辺の膨らみ", desc: "銀河中心部の星が密集した領域。古い星が多く存在する。", isGalaxy: true },
                { name: "オリオン腕", color: 0xCCDDEE, size: 60000, pos: [520000, 0, 100000], meta: "銀河の螺旋腕", desc: "太陽系が位置する天の川銀河の腕状構造。", isGalaxy: true },
                { name: "ペルセウス腕", color: 0x640000, size: 80000, pos: [640000, 0, -300000], meta: "銀河の螺旋腕", desc: "天の川銀河の主要な二つの腕の一つ。", isGalaxy: true },
                { name: "いて・りゅうこつ腕", color: 0xFFEECC, size: 70000, pos: [300000, 0, 240000], meta: "銀河の螺旋腕", desc: "銀河中心とオリオン腕の間に位置する腕。", isGalaxy: true },
                { name: "ヘルクレス座・たて腕", color: 0xFFDDCC, size: 80000, pos: [-200000, 0, -160000], meta: "銀河の螺旋腕", desc: "銀河の主要な腕の一つ。", isGalaxy: true },
                { name: "大マゼラン雲", color: 0xEEEEFF, size: 280000, pos: [0, -2400000, -3200000], meta: "伴銀河 (不規則銀河)", desc: "天の川銀河の周囲を回る最大の伴銀河。", isGalaxy: true },
                { name: "小マゼラン雲", color: 0xDDDDFF, size: 160000, pos: [1000000, -3000000, -4000000], meta: "伴銀河 (不規則銀河)", desc: "天の川銀河の伴銀河の一つ。大マゼラン雲の近くにある。", isGalaxy: true },
                { name: "おえ座矮小銀河", color: 0xCCCCCC, size: 80000, pos: [-1000000, 1600000, 600000], meta: "伴銀河", desc: "天の川銀河に最も近い矮小銀河の一つ。", isGalaxy: true },
                { name: "ヘルクレス座星団 (M13)", color: 0xFFFFFF, size: 10000, pos: [440000, 300000, -100000], meta: "球状星団", desc: "北天で最も有名な球状星団の一つ。数十万個の星が集まっている。", isGalaxy: true },
                { name: "オメガ・ケンタウリ", color: 0xFFFFEE, size: 16000, pos: [300000, -200000, -200000], meta: "球状星団", desc: "天の川銀河で最大の球状星団。数百万個の星を含む。", isGalaxy: true },
                { name: "らせん星雲 NGC 7293", color: 0x44FFCC, size: 5000, pos: [320000, 100000, 200000], meta: "惑星状星雲", desc: "地球に最も近い惑星状星雲の一つ。その形状から「神の目」とも呼ばれる。", isGalaxy: true },
                { name: "網膜星雲 IC 4406", color: 0x88FF88, size: 4000, pos: [-100000, -400000, 250000], meta: "惑星状星雲", desc: "ドーナツ状の構造を真横から見た、網膜のような複雑な模様を持つ星雲。", isGalaxy: true },
                { name: "たまご星雲 CRL 2688", color: 0xFFFFEE, size: 3500, pos: [150000, 500000, -100000], meta: "原始惑星状星雲", desc: "中心星から噴き出す同心円状のシェルが特徴的な、星の死の初期段階。", isGalaxy: true },
                { name: "猫の目星雲 NGC 6543", color: 0x66FFFF, size: 4500, pos: [0, 600000, 300000], meta: "惑星状星雲", desc: "複雑で対称的な構造を持つ、りゅう座の惑星状星雲。", isGalaxy: true },
                { name: "バグ星雲 NGC 6302", color: 0xFFDDDD, size: 6000, pos: [200000, -150000, -50000], meta: "惑星状星雲", desc: "蝶が羽を広げたような劇的な形状を持つ、極めて高温の中心星を持つ星雲。", isGalaxy: true },
                { name: "星形成領域 S106", color: 0xFF99BB, size: 7000, pos: [400000, 200000, -400000], meta: "HII領域", desc: "巨大な双極分子流が砂時計のような形を作っている若い星の誕生場。", isGalaxy: true },
                { name: "カリーナ星雲", color: 0xFF4444, size: 15000, pos: [-600000, -500000, 800000], meta: "散光星雲", desc: "りゅうこつ座にある巨大な星雲。有名な「ミスティック・マウンテン」などを含む。", isGalaxy: true },
                { name: "オメガ星雲", color: 0xFF88AA, size: 9000, pos: [250000, -100000, 50000], meta: "M17", desc: "「白鳥星雲」とも呼ばれる、活発な星形成が行われているHII領域。", isGalaxy: true },
                { name: "星形成領域 NGC 3603", color: 0xFFCCFF, size: 8000, pos: [-450000, -300000, 600000], meta: "散開星団・星雲", desc: "銀河系内で最も密度の高い巨大HII領域の一つ。若く重い星が密集している。", isGalaxy: true },
                { name: "かに星雲 M1", color: 0xEECCFF, size: 5500, pos: [-200000, 100000, 400000], meta: "超新星残骸", desc: "1054年に観測された超新星の残骸。中心にはパルサーが存在する。", isGalaxy: true },
                { name: "超新星残骸 SN1006", color: 0xCCDDFF, size: 7000, pos: [10000, -400000, -200000], meta: "超新星残骸", desc: "1006年に出現した、史上最も明るく記録された超新星の残骸。", isGalaxy: true },
                { name: "カシオペヤ座 A", color: 0xFFBB88, size: 5000, pos: [-300000, 400000, -300000], meta: "超新星残骸", desc: "強力な電波源。約330年前に爆発した星の残骸が広がっている。", isGalaxy: true },
                { name: "球状星団 M80", color: 0xFFFFFF, size: 6000, pos: [150000, -250000, 50000], meta: "球状星団", desc: "さそり座にある非常に高密度な球状星団。数万個の星が球状に集まる。", isGalaxy: true },
                { name: "オメガ星団 NGC 5139", color: 0xFFFFEE, size: 18000, pos: [300000, -200000, -200000], meta: "最大級の球状星団", desc: "銀河系最大の球状星団。かつては別の銀河の中心核だった可能性が高い。", isGalaxy: true },
                { name: "散開星団 NGC 265", color: 0xCCDDEE, size: 4000, pos: [950000, -2900000, -3900000], meta: "小マゼラン雲内の星団", desc: "小マゼラン雲に位置する輝かしい散開星団。", isGalaxy: true },
                { name: "かじき座30", color: 0xFF66AA, size: 25000, pos: [50000, -2450000, -3250000], meta: "タランチュラ星雲", desc: "大マゼラン雲にある超巨大なHII領域。局所銀河群最大級の星形成場。", isGalaxy: true },
                { name: "巨大な空洞 N44F", color: 0xAAEEFF, size: 12000, pos: [-50000, -2400000, -3150000], meta: "スーパーバブル", desc: "大マゼラン雲にある、星風によって形成された巨大なガスの空洞。", isGalaxy: true },
                { name: "超新星残骸 0509-67.5", color: 0xFF7777, size: 4500, pos: [10000, -2420000, -3220000], meta: "Ia型超新星残骸", desc: "大マゼラン雲にある、完璧に近い球形を保った衝撃波のシェル。", isGalaxy: true },
                { name: "LMC N 49", color: 0xFFCC33, size: 6500, pos: [-20000, -2380000, -3180000], meta: "超新星残骸", desc: "大マゼラン雲内で最も明るい超新星残骸。フィラメント構造が美しい。", isGalaxy: true },
                { name: "星形成領域 NGC 602", color: 0x99CCFF, size: 8500, pos: [1020000, -3050000, -4050000], meta: "散開星団・星雲", desc: "小マゼラン雲の周辺部に位置する、宝石箱のような若い星団と星雲。", isGalaxy: true },
                { name: "NGC 346", color: 0xFFEEAA, size: 14000, pos: [1000000, -3020000, -4020000], meta: "星形成領域", desc: "小マゼラン雲で最大かつ最も活発な星形成領域。", isGalaxy: true }
            ],
            galaxies: [
                { name: "アンドロメダ銀河 M31", color: 0xCCDDFE, size: 1200000, pos: [15000000, 4000000, -12000000], meta: "局所銀河群最大", desc: "天の川銀河に最も近い大型の渦巻銀河。約40億年後には我々の銀河と衝突すると予想されている。", isGalaxy: true },
                { name: "渦巻銀河 M63", color: 0xFFFFCC, size: 700000, pos: [28000000, 8000000, 5000000], meta: "ひまわり銀河", desc: "猟犬座にある美しい渦巻銀河。ひまわりの花のような多数の腕を持つため「ひまわり銀河」と呼ばれる。", isGalaxy: true },
                { name: "不規則銀河 NGC 1569", color: 0xCCFFFF, size: 400000, pos: [-11000000, -5000000, 18000000], meta: "スターバースト銀河", desc: "きりん座にある小型の不規則銀河。爆発的な星形成（スターバースト）が起きていることで知られる。", isGalaxy: true },
                { name: "渦巻銀河 NGC 6946", color: 0xFFCCCC, size: 850000, pos: [22000000, 15000000, -10000000], meta: "花火銀河", desc: "超新星が頻繁に観測されるため「花火銀河」の愛称を持つ。正面を向いた見事な渦巻構造。", isGalaxy: true },
                { name: "渦巻銀河 M101", color: 0xCCDDEE, size: 1000000, pos: [21000000, 25000000, 5000000], meta: "回転花火銀河", desc: "おおぐま座にある巨大な渦巻銀河。非常に発達した螺旋状の腕を持つ。", isGalaxy: true },
                { name: "ソンブレロ銀河 M104", color: 0xFFFFFF, size: 800000, pos: [29000000, -8000000, 15000000], meta: "巨大な暗黒帯", desc: "おとめ座にある銀河。帽子のような形と、縁を横切る非常に明瞭な暗黒の塵の帯が特徴。", isGalaxy: true },
                { name: "子持ち銀河 M51", color: 0x99BBFF, size: 900000, pos: [31000000, 20000000, -8000000], meta: "相互作用銀河", desc: "大きな渦巻銀河(M51a)と小さな伴銀河(M51b)が重力で引き合っている有名な相互作用銀河。", isGalaxy: true },
                { name: "渦巻銀河 NGC 2841", color: 0xCCCCEE, size: 750000, pos: [-46000000, 25000000, 0], meta: "羊毛状渦巻銀河", desc: "腕が途切れた「羊毛状」の構造を持つ銀河。整った螺旋とは異なる独特の美しさを持つ。", isGalaxy: true },
                { name: "棒渦巻銀河 NGC 1300", color: 0xFFEECC, size: 950000, pos: [-61000000, -35000000, -10000000], meta: "典型的な棒渦巻銀河", desc: "エリダヌス座にある。中心に顕著な棒状構造を持ち、そこから腕が伸びる非常に整った形状の銀河。", isGalaxy: true },
                { name: "渦巻銀河 UGC 10214", color: 0xDDEEFF, size: 1100000, pos: [420000000, 50000000, -20000000], meta: "Tadpole Galaxy", desc: "りゅう座にある相互作用銀河。過去の衝突により、オタマジャクシの尾のような長いガスと星の列が伸びている。", isGalaxy: true }
            ],
            clusters: [
                { name: "銀河団 Abell 1689", color: 0xFFEEDD, size: 5000000, pos: [2500000000, 1500000000, -800000000], meta: "巨大銀河団 (重力レンズ効果)", desc: "宇宙で最も巨大で密度の高い銀河団の一つ。その凄まじい質量により背後の銀河の光を曲げる「重力レンズ効果」を鮮明に引き起こす。", isGalaxy: true },
                { name: "触角銀河 NGC 4038-4039", color: 0xFF88AA, size: 1200000, pos: [55000000, -10000000, 15000000], meta: "相互作用銀河 (アンテナ銀河)", desc: "からす座にある2つの渦巻銀河が衝突している現場。衝突の衝撃により長い「触角」のような構造が伸びている。", isGalaxy: true },
                { name: "三つ子の銀河 Arp 274", color: 0xCCDDEE, size: 1500000, pos: [-40000000, 30000000, 20000000], meta: "銀河群 (NGC 5679)", desc: "3つの銀河が非常に密接して見える美しい天体。実際には一部が重なり、活発な星形成が見られる。", isGalaxy: true },
                { name: "衝突する渦巻銀河 NGC 6050 & IC 1179", color: 0xCCFFEE, size: 1800000, pos: [450000000, 150000000, -100000000], meta: "ヘルクレス座銀河団内", desc: "2つの渦巻銀河が融合しつつあるダイナミックな姿。銀河団の中心付近に位置する相互作用銀河。", isGalaxy: true },
                { name: "衝突する銀河 NGC 3690", color: 0xFFCC33, size: 1000000, pos: [120000000, 60000000, 80000000], meta: "Arp 299", desc: "2つの銀河が激しく衝突し、強力な赤外線と超新星爆発を放出しているスターバースト銀河。", isGalaxy: true },
                { name: "ステファンの五つ子", color: 0xFFDDDD, size: 1600000, pos: [600000000, -400000000, 800000000], meta: "HCG 92 (コンパクト銀河群)", desc: "ペガスス座にある5つの銀河が密集した銀河群。実際には4つが物理的に関連し、激しい相互作用を起こしている。", isGalaxy: true },
                { name: "環銀河 AM 0644-741", color: 0x99BBFF, size: 1400000, pos: [-80000000, -120000000, 50000000], meta: "衝突環銀河 (Lindsay-Shapley Ring)", desc: "中心に小さな銀河が通り抜けた際、衝撃波が星形成を促し、輝く「指輪」のような円環構造を作った。", isGalaxy: true },
                { name: "三つの銀河 Arp 273", color: 0xEECCFF, size: 1300000, pos: [300000000, -50000000, 200000000], meta: "バラのような銀河 (UGC 1810)", desc: "大きな渦巻銀河が伴銀河の重力により歪み、バラの花のような優美な形に引き伸ばされている。", isGalaxy: true }
            ],
            superclusters: [
                { name: "ラニアケア超銀河団", color: 0xAAFFCC, size: 20000000, pos: [0, 0, 0], meta: "Laniakea", desc: "天の川銀河を含む巨大な超銀河団. ハワイ語で「無限の天空」を意味する。", isGalaxy: true },
                { name: "おとめ座超銀河団", color: 0xFFDD99, size: 12000000, pos: [1000000000, 400000000, 200000000], meta: "Virgo Supercluster", desc: "ラニアケアの一部。おとめ座銀河団や局所銀河群を包含する。", isGalaxy: true },
                { name: "SDSS J1004+4122", color: 0xCCDDFF, size: 6000000, pos: [12000000000, 3000000000, -1500000000], meta: "銀河団による重力レンズ", desc: "史上初めて発見された、銀河団全体が重力レンズとして機能し、遠方のクエーサーを5つに分裂させて見せている非常に稀な天体。", isGalaxy: true },
                { name: "J033238-275653", color: 0xFFDDAA, size: 3000000, pos: [-15000000000, -2000000000, 5000000000], meta: "銀河による重力レンズ", desc: "非常に高い解像度で観測された重力レンズ。遠方の銀河の像がレンズ銀河の周囲にアインシュタイン・リングあるいは弧として美しく引き伸ばされている。", isGalaxy: true },
                { name: "シャプレー超銀河団", color: 0xFFCCAA, size: 30000000, pos: [4000000000, 2000000000, -3000000000], meta: "Shapley Supercluster", desc: "近傍宇宙で最大の重力異常域の一つ。銀河の流れを引き寄せている。", isGalaxy: true },
                { name: "ペルセウス・うお座", color: 0xCCCCFF, size: 18000000, pos: [-2000000000, 1000000000, 2400000000], meta: "Perseus-Pisces Supercluster", desc: "宇宙で知られる最大級の構造の一つ。フィラメント状に広がっている。", isGalaxy: true },
                { name: "ヘルクレス座超銀河団", color: 0xDDFFDD, size: 24000000, pos: [8000000000, 5000000000, 1000000000], meta: "Hercules Superclusters", desc: "複数の超銀河団が集まった広大な領域。", isGalaxy: true },
                { name: "うみへび・ケンタウルス", color: 0xFFEEFF, size: 17000000, pos: [2400000000, -1600000000, -1000000000], meta: "Hydra-Centaurus Supercluster", desc: "グレート・アトラクターを含む超銀河団。", isGalaxy: true },
                { name: "パヴォ・インディアン", color: 0xCCFFEE, size: 14000000, pos: [-1000000000, -3000000000, -400000000], meta: "Pavo-Indus Supercluster", desc: "おとめ座超銀河団の近隣に位置する構造。", isGalaxy: true },
                { name: "うい座・くじら座", color: 0xFFEEBB, size: 40000000, pos: [0, 0, 10000000000], meta: "Pisces-Cetus Complex", desc: "銀河フィラメント、あるいは銀河フィラメントの複合体。驚異的な規模を持つ。", isGalaxy: true }
            ],
            cosmic: [
                { name: "宇宙背景輻射 (CMB)", color: 0xFF8844, size: 480000000, pos: [0, 0, 0], meta: "宇宙最古の光", desc: "ビッグバンから約38万年後、宇宙の晴れ上がりによって放たれたマイクロ波背景放射。観測可能な宇宙の最果てを象徴する。", isGalaxy: true },
                { name: "ダークマター・ネットワーク", color: 0x4444FF, size: 120000000, pos: [5000000000, 2000000000, -3000000000], meta: "見えない宇宙の骨格", desc: "銀河の形成を導くダークマターの巨大なフィラメント構造。重力レンズ観測によって裏付けられた、宇宙の大規模構造の基盤。", isGalaxy: true },
                { name: "スローン・グレートウォール", color: 0xFFFFFF, size: 80000000, pos: [20000000000, 0, 0], meta: "銀河の壁", desc: "かつて知られていた宇宙最大級の構造。長さは約13.7億光年に及ぶ。", isGalaxy: true },
                { name: "ボイオテス・ボイド", color: 0x000000, size: 60000000, pos: [0, 16000000000, 6000000000], meta: "超空洞", desc: "直径2.5億〜3.3億光年に及ぶ巨大な空洞。銀河がほとんど存在しない。", isGalaxy: true },
                { name: "CfA2グレートウォール", color: 0xDDDDFF, size: 50000000, pos: [-14000000000, 6000000000, 0], meta: "銀河の壁", desc: "人類が初めて発見した宇宙の大規模構造の一つ。", isGalaxy: true },
                { name: "グレート・アトラクター", color: 0xFF5500, size: 20000000, pos: [3000000000, -2000000000, -1000000000], meta: "重力異常点", desc: "数億光年におよぶ範囲の銀河の動きを規定する巨大な重力の中心。", isGalaxy: true }
            ],
            others: [
                { name: "パイオニア・プラーク", color: 0xFFD700, size: 100, pos: [500000, 100000, 500000], meta: "宇宙探査機パイオニア10・11号", desc: "外宇宙に向けた人類からの最初のメッセージ。銀河系における地球の位置や人類の姿が描かれている。"},
                { name: "ISS", color: 0x888888, size: 50, pos: [81000, 1500, 0], meta: "国際宇宙ステーション", desc: "地上約400kmを周回する。このシミュレーターでは地球周辺のシンボルとして配置。"}
            ]
        };

        function generateFullSatellites() {
            const moonsRaw = {
                "地球": ["月"],
                "火星": ["フォボス", "ダイモス"],
                "木星": ["イオ", "エウロパ", "ガニメデ", "カリスト", "アマルテア", "ヒマリア", "テーベ", "メティス", "アドラステア"],
                "土星": ["ミマス", "エンケラドゥス", "テティス", "ディオネ", "レア", "タイタン", "ヒペリオン", "アイアペトゥス", "ヤヌス", "エピメテウス"],
                "天王星": ["アリエル", "ウンブリエル", "チタニア", "オベロン", "ミランダ", "パック"],
                "海王星": ["トリトン", "プロテウス", "ネレイド", "ラリッサ"],
                "冥王星": ["カロン", "ニクス", "ヒドラ"]
            };
            Object.entries(moonsRaw).forEach(([planet, moons]) => {
                moons.forEach((name, i) => {
                    const distBase = 200 + (i * 120);
                    DATA.satellites.push({
                        name: name, parent: planet, color: 0xDDDDDD,
                        size: name === "月" ? 200 : (name === "ガニメデ" || name === "タイタン" ? 500 : 120),
                        dist: distBase * 15.0,
                        speed: 0.15 * Math.pow(100/distBase, 0.5),
                        meta: planet + "の衛星",
                        desc: name + "は" + planet + "の周りを回る主要な衛星の一つです。"
                    });
                });
            });
        }
        generateFullSatellites();

        function generateRealisticTexture(type, baseColor) {
            const canvas = document.createElement('canvas');
            canvas.width = 512; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            const w = canvas.width, h = canvas.height;
            const r = (baseColor >> 16) & 255, g = (baseColor >> 8) & 255, b = baseColor & 255;
            ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            ctx.fillRect(0, 0, w, h);
            if (type === "gas") {
                for (let i = 0; i < 40; i++) {
                    const y = Math.random() * h;
                    ctx.fillStyle = 'rgba(' + Math.floor(r*0.7) + ',' + Math.floor(g*0.7) + ',' + Math.floor(b*0.7) + ', 0.5)';
                    ctx.fillRect(0, y, w, Math.random()*20+5);
                }
            } else if (type === "rocky") {
                for (let i = 0; i < 2000; i++) {
                    ctx.fillStyle = 'rgba(0,0,0,' + (Math.random()*0.3) + ')';
                    ctx.fillRect(Math.random()*w, Math.random()*h, 2, 2);
                }
            }
            return new THREE.CanvasTexture(canvas);
        }

        function createGalaxyMesh(size, color, opacity, density) {
            opacity = opacity || 0.6;
            density = density || 2000;
            const group = new THREE.Group();
            const core = createGlow(size * 1.8, color, 0.9, false);
            group.add(core);
            const geom = new THREE.BufferGeometry();
            const pos = [];
            const colors = [];
            const r_base = (color >> 16) & 255, g_base = (color >> 8) & 255, b_base = color & 255;
            for (let i = 0; i < density; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.pow(Math.random(), 0.5) * size;
                const spiral = dist * 0.005;
                const x = Math.cos(angle + spiral) * dist + (Math.random() - 0.5) * (size * 0.2);
                const y = (Math.random() - 0.5) * (size * 0.1);
                const z = Math.sin(angle + spiral) * dist + (Math.random() - 0.5) * (size * 0.2);
                pos.push(x, y, z);
                colors.push(r_base/255, g_base/255, b_base/255);
            }
            geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            const mat = new THREE.PointsMaterial({ size: size * 0.02, vertexColors: true, transparent: true, opacity: opacity, blending: THREE.AdditiveBlending });
            group.add(new THREE.Points(geom, mat));
            return group;
        }

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 50000000000);
            camera.position.set(200000, 100000, 200000);
            renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.body.appendChild(renderer.domElement);
            mainGroup = new THREE.Group();
            orbitGroup = new THREE.Group();
            cosmicGroup = new THREE.Group();
            asteroidBeltGroup = new THREE.Group();
            scene.add(mainGroup);
            scene.add(orbitGroup);
            scene.add(cosmicGroup);
            scene.add(asteroidBeltGroup);
            setupLights();
            createSpaceBackground();
            buildUniverse();
            createCosmicWeb();
            createMassiveAsteroidBelt();
            switchCategory('solar');
            setupControls();
            document.getElementById('speed-slider').oninput = function(e) {
                const val = parseFloat(e.target.value);
                simulationSpeed = val * 0.01;
                document.getElementById('speed-val').innerText = val.toFixed(1) + 'x';
            };
            animate();
        }

        function createOrbit(dist, color, parentGroup, isEllipse, a, e) {
            isEllipse = isEllipse || false;
            a = a || 0; e = e || 0;
            const points = [];
            const segments = 256;
            if (isEllipse) {
                const b = a * Math.sqrt(1 - e * e);
                for (let i = 0; i <= segments; i++) {
                    const angle = (i / segments) * Math.PI * 2;
                    points.push(new THREE.Vector3(a * Math.cos(angle) - a * e, 0, b * Math.sin(angle)));
                }
            } else {
                for (let i = 0; i <= segments; i++) {
                    const angle = (i / segments) * Math.PI * 2;
                    points.push(new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist));
                }
            }
            const geom = new THREE.BufferGeometry().setFromPoints(points);
            const mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.15 });
            const line = new THREE.Line(geom, mat);
            if (parentGroup) parentGroup.add(line);
            else orbitGroup.add(line);
            return line;
        }

        function createLabel(text) {
            const div = document.createElement('div');
            div.className = 'celestial-label';
            div.textContent = text;
            document.getElementById('labels-container').appendChild(div);
            return div;
        }

        function createGlow(size, color, opacity, flare) {
            opacity = opacity || 0.5;
            flare = flare || false;
            const canvas = document.createElement('canvas');
            canvas.width = 256; canvas.height = 256;
            const ctx = canvas.getContext('2d');
            const r = (color >> 16) & 255, g = (color >> 8) & 255, b = color & 255;
            const grad = ctx.createRadialGradient(128,128,0, 128,128,128);
            grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')');
            grad.addColorStop(0.3, 'rgba(' + r + ',' + g + ',' + b + ',' + (opacity*0.4) + ')');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad; ctx.fillRect(0,0,256,256);
            if(flare) {
                ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ', 0.2)';
                ctx.fillRect(126, 0, 4, 256); ctx.fillRect(0, 126, 256, 4);
            }
            const tex = new THREE.CanvasTexture(canvas);
            const mat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
            const s = new THREE.Sprite(mat);
            s.scale.set(size, size, 1);
            return s;
        }

        function createCosmicWeb() {
            const count = 30000;
            const pos = [];
            const hubs = DATA.superclusters.map(function(s) { return new THREE.Vector3(s.pos[0], s.pos[1], s.pos[2]); });
            for(let i=0; i<count; i++) {
                const start = hubs[Math.floor(Math.random() * hubs.length)];
                const end = hubs[Math.floor(Math.random() * hubs.length)];
                const t = Math.random();
                const noise = 100000000;
                pos.push(
                    start.x + (end.x - start.x) * t + (Math.random()-0.5) * noise,
                    start.y + (end.y - start.y) * t + (Math.random()-0.5) * noise,
                    start.z + (end.z - start.z) * t + (Math.random()-0.5) * noise
                );
            }
            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({ size: 10000000, color: 0x445588, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
            cosmicGroup.add(new THREE.Points(geom, mat));
        }

        function createMassiveAsteroidBelt() {
            const count = 870000;
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const innerRadius = 126000;
            const outerRadius = 198000;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = innerRadius + (Math.random() * (outerRadius - innerRadius));
                const spread = 400;
                positions[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * spread;
                positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5;
                positions[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * spread;
                const brightness = 0.4 + Math.random() * 0.4;
                colors[i * 3] = brightness;
                colors[i * 3 + 1] = brightness * 0.95;
                colors[i * 3 + 2] = brightness * 0.9;
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const material = new THREE.PointsMaterial({ size: 20, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true });
            asteroidBeltGroup.add(new THREE.Points(geometry, material));
        }

        function setupLights() {
            scene.add(new THREE.AmbientLight(0x222233, 0.5));
            const sunLight = new THREE.PointLight(0xffffff, 3, 20000000);
            scene.add(sunLight);
        }

        function createSpaceBackground() {
            const starGeom = new THREE.BufferGeometry();
            const starPos = [];
            for(let i=0; i<150000; i++) {
                const r = 40000000000 * Math.pow(Math.random(), 0.5);
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                starPos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            }
            starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
            scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.5 })));
        }

        function buildUniverse() {
            DATA.solar.forEach(function(d) {
                const group = new THREE.Group();
                const isSun = d.dist === 0;
                const mat = new THREE.MeshPhongMaterial({ color: d.color, shininess: isSun ? 0 : 30 });
                if (isSun) { mat.emissive = new THREE.Color(d.color); mat.emissiveIntensity = 2.0; }
                else mat.map = generateRealisticTexture(d.type, d.color);
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 32, 32), mat));
                group.add(createGlow(d.size * (isSun ? 12 : 2.5), d.color, 0.4, isSun));
                if (d.hasRing) {
                    const rGeom = new THREE.RingGeometry(d.size * d.ringInner, d.size * d.ringOuter, 64);
                    const rMat = new THREE.MeshPhongMaterial({ color: d.ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
                    const ring = new THREE.Mesh(rGeom, rMat);
                    ring.rotation.x = Math.PI/2;
                    group.add(ring);
                }
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, angle: Math.random()*Math.PI*2, label: createLabel(d.name), type: 'solar' });
                if(d.dist > 0) createOrbit(d.dist, d.color);
            });

            DATA.dwarfs.forEach(function(d) {
                const group = new THREE.Group();
                const mat = new THREE.MeshPhongMaterial({ color: d.color, map: generateRealisticTexture(d.type, d.color) });
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 32, 32), mat));
                group.add(createGlow(d.size * 2.5, d.color, 0.4));
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, angle: Math.random()*Math.PI*2, label: createLabel(d.name), type: 'dwarf' });
                createOrbit(d.dist, d.color);
            });

            DATA.asteroids.forEach(function(d) {
                const group = new THREE.Group();
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 32, 32), new THREE.MeshPhongMaterial({ color: d.color, map: generateRealisticTexture(d.type, d.color) })));
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, angle: Math.random()*Math.PI*2, label: createLabel(d.name), type: 'asteroid' });
                createOrbit(d.dist, d.color);
            });

            DATA.tnos.forEach(function(d) {
                const group = new THREE.Group();
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 32, 32), new THREE.MeshPhongMaterial({ color: d.color, map: generateRealisticTexture(d.type, d.color) })));
                group.add(createGlow(d.size * 2.5, d.color, 0.4));
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, angle: Math.random()*Math.PI*2, label: createLabel(d.name), type: 'tno' });
                createOrbit(d.dist, d.color);
            });

            DATA.comets.forEach(function(d) {
                const group = new THREE.Group();
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 16, 16), new THREE.MeshBasicMaterial({ color: 0xFFFFFF })));
                group.add(createGlow(d.size * 25, d.color || 0x00FFFF, 0.3));
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, angle: Math.random()*Math.PI*2, label: createLabel(d.name), type: 'comet' });
                createOrbit(0, d.color || 0x00FFFF, null, true, d.a, d.e);
            });

            DATA.satellites.forEach(function(d) {
                const group = new THREE.Group();
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 12, 12), new THREE.MeshPhongMaterial({ color: d.color })));
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, angle: Math.random()*Math.PI*2, label: createLabel(d.name), type: 'satellite' });
                const parent = celestialObjects.find(function(o) { return o.data.name === d.parent; });
                if (parent) createOrbit(d.dist, d.color, parent.mesh);
            });

            DATA.stars.forEach(function(d) {
                const group = new THREE.Group();
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 32, 32), new THREE.MeshBasicMaterial({ color: d.color })));
                group.add(createGlow(d.size * 5, d.color, 0.5, true));
                group.position.set(d.pos[0], d.pos[1], d.pos[2]);
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, label: createLabel(d.name), type: 'star' });
            });

            DATA.milkyway.forEach(function(d) {
                const group = createGalaxyMesh(d.size, d.color, 0.6, 2500);
                group.position.set(d.pos[0], d.pos[1], d.pos[2]);
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, label: createLabel(d.name), type: 'milkyway' });
            });

            DATA.galaxies.forEach(function(d) {
                const group = createGalaxyMesh(d.size, d.color);
                group.position.set(d.pos[0], d.pos[1], d.pos[2]);
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, label: createLabel(d.name), type: 'galaxy' });
            });

            DATA.clusters.forEach(function(d) {
                const group = createGalaxyMesh(d.size, d.color, 0.7, 4000);
                group.position.set(d.pos[0], d.pos[1], d.pos[2]);
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, label: createLabel(d.name), type: 'cluster' });
            });

            DATA.superclusters.forEach(function(d) {
                const group = createGalaxyMesh(d.size, d.color, 0.4, 8000);
                group.position.set(d.pos[0], d.pos[1], d.pos[2]);
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, label: createLabel(d.name), type: 'supercluster' });
            });

            DATA.cosmic.forEach(function(d) {
                const group = createGalaxyMesh(d.size, d.color, 0.2, 12000);
                group.position.set(d.pos[0], d.pos[1], d.pos[2]);
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, label: createLabel(d.name), type: 'cosmic' });
            });

            DATA.others.forEach(function(d) {
                const group = new THREE.Group();
                group.add(new THREE.Mesh(new THREE.SphereGeometry(d.size, 16, 16), new THREE.MeshBasicMaterial({ color: d.color })));
                group.position.set(d.pos[0], d.pos[1], d.pos[2]);
                mainGroup.add(group);
                celestialObjects.push({ mesh: group, data: d, label: createLabel(d.name), type: 'others' });
            });
        }

        function switchCategory(cat) {
            document.querySelectorAll('.view-switcher button').forEach(function(b) { b.classList.remove('active'); });
            const btn = document.getElementById('btn-' + cat);
            if(btn) btn.classList.add('active');
            const container = document.getElementById('target-buttons');
            container.innerHTML = '';
            if (cat === 'satellites') {
                const parents = ["地球", "火星", "木星", "土星", "天王星", "海王星", "冥王星"];
                parents.forEach(function(pName) {
                    const groupSats = DATA.satellites.filter(function(s) { return s.parent === pName; });
                    if (groupSats.length > 0) {
                        const l = document.createElement('div'); l.className = 'category-label'; l.innerText = pName + "の衛星"; container.appendChild(l);
                        groupSats.forEach(function(d) {
                            const b = document.createElement('button'); b.className = 'celestial-btn'; b.innerText = d.name;
                            b.onclick = function() { focusOn(d.name); }; container.appendChild(b);
                        });
                    }
                });
            } else {
                let list = DATA[cat];
                const labels = {solar:"太陽系主要天体", dwarfs:"準惑星", asteroids:"主要小惑星", tnos:"地球外縁天体", comets:"主要彗星", stars:"恒星カタログ", milkyway:"銀河系構造・星雲", galaxies:"主要銀河", clusters:"銀河群・銀河団", superclusters:"超銀河団構造", cosmic:"大規模構造", others:"その他"};
                const l = document.createElement('div'); l.className = 'category-label'; l.innerText = labels[cat]; container.appendChild(l);
                list.forEach(function(d) {
                    const b = document.createElement('button'); b.className = 'celestial-btn'; b.innerText = d.name;
                    b.onclick = function() { focusOn(d.name); }; container.appendChild(b);
                });
            }
        }

        function focusOn(name) {
            const obj = celestialObjects.find(function(o) { return o.data.name === name; });
            if (!obj) return;
            trackingTarget = obj;
            const size = obj.data.size;
            if (obj.type === 'cosmic' || obj.type === 'supercluster') zoomDistance = size * 3;
            else if (obj.type === 'cluster') zoomDistance = size * 4;
            else if (obj.type === 'galaxy' || obj.type === 'milkyway') zoomDistance = size * 4;
            else if (obj.type === 'star') zoomDistance = size * 10;
            else if (obj.type === 'solar' && obj.data.dist === 0) zoomDistance = size * 10;
            else if (obj.type === 'satellite') zoomDistance = 5000;
            else if (size < 20) zoomDistance = 5000;
            else zoomDistance = size * 20;
            document.getElementById('info-name').innerText = obj.data.name;
            document.getElementById('info-meta').innerText = obj.data.meta || "天体構造";
            document.getElementById('info-desc').innerText = obj.data.desc || "詳細情報なし";
            document.getElementById('info-panel').style.display = 'block';
        }

        function toggleControlPanel(hide) {
            document.getElementById('main-control-panel').style.display = hide ? 'none' : 'block';
            document.getElementById('restore-panel-btn').style.display = hide ? 'block' : 'none';
        }

        function updateVisibilitySettings() {
            showOrbits = document.getElementById('toggle-orbit').checked;
            showLabels = document.getElementById('toggle-label').checked;
            orbitGroup.visible = showOrbits;
            if (!showLabels) document.querySelectorAll('.celestial-label').forEach(function(l) { l.style.display = 'none'; });
            else document.querySelectorAll('.celestial-label').forEach(function(l) { l.style.display = 'block'; });
        }

        function setupControls() {
            let drag = false, lastPos = {x:0, y:0};
            let lastDist = 0;

            window.onmousedown = function(e) { if (e.target.closest('.interactive')) return; drag = true; };
            window.onmouseup = function() { drag = false; };
            window.onmousemove = function(e) { handleRotate(e.clientX, e.clientY); };
            window.onwheel = function(e) { if (e.target.closest('.interactive')) return; zoomDistance *= (e.deltaY > 0 ? 1.1 : 0.9); e.preventDefault(); };

            window.addEventListener('touchstart', function(e) {
                if (e.target.closest('.interactive')) return;
                if (e.touches.length === 1) {
                    drag = true;
                    lastPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                } else if (e.touches.length === 2) {
                    drag = false;
                    lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                }
            }, { passive: false });

            window.addEventListener('touchend', function() { drag = false; lastDist = 0; });

            window.addEventListener('touchmove', function(e) {
                if (e.target.closest('.interactive')) return;
                e.preventDefault();
                if (e.touches.length === 1 && drag) {
                    handleRotate(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 2) {
                    const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    if (lastDist > 0) zoomDistance *= (lastDist / dist);
                    lastDist = dist;
                }
            }, { passive: false });

            function handleRotate(x, y) {
                if(drag) {
                    const dx = x - lastPos.x;
                    const dy = y - lastPos.y;
                    const offset = new THREE.Vector3().subVectors(camera.position, currentLookAt);
                    const theta = Math.atan2(offset.x, offset.z) - dx * 0.005;
                    const phi = Math.max(0.1, Math.min(Math.PI - 0.1, Math.acos(Math.min(1, Math.max(-1, offset.y / offset.length()))) - dy * 0.005));
                    cameraOffset.set(Math.sin(phi) * Math.sin(theta), Math.cos(phi), Math.sin(phi) * Math.cos(theta));
                }
                lastPos = {x: x, y: y};
            }

            window.onresize = function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
        }

        function animate() {
            requestAnimationFrame(animate);
            const ts = simulationSpeed * 60;
            celestialObjects.forEach(function(p) {
                if ((p.type === 'solar' || p.type === 'dwarf' || p.type === 'asteroid' || p.type === 'tno') && p.data.dist > 0) {
                    p.angle += p.data.speed * ts;
                    p.mesh.position.set(Math.cos(p.angle)*p.data.dist, 0, Math.sin(p.angle)*p.data.dist);
                } else if (p.type === 'comet') {
                    const a = p.data.a, e = p.data.e, b = a * Math.sqrt(1 - e * e);
                    const r = a * (1 - e * Math.cos(p.angle));
                    p.angle += p.data.speed * Math.pow(a / r, 1.5) * ts;
                    p.mesh.position.set(a * Math.cos(p.angle) - a * e, 0, b * Math.sin(p.angle));
                } else if (p.type === 'satellite') {
                    p.angle += p.data.speed * ts;
                    const parent = celestialObjects.find(function(o) { return o.data.name === p.data.parent; });
                    if (parent) {
                        p.mesh.position.set(parent.mesh.position.x + Math.cos(p.angle)*p.data.dist, parent.mesh.position.y, parent.mesh.position.z + Math.sin(p.angle)*p.data.dist);
                    }
                } else if (p.type === 'galaxy' || p.type === 'cluster' || p.type === 'supercluster' || p.type === 'cosmic' || p.type === 'milkyway') {
                    p.mesh.rotation.y += 0.0003 * ts;
                }
            });
            asteroidBeltGroup.rotation.y += 0.0001 * ts;
            if (trackingTarget) {
                const wp = new THREE.Vector3();
                trackingTarget.mesh.getWorldPosition(wp);
                targetLookAt.copy(wp);
                currentLookAt.copy(targetLookAt);
            }
            const idealPos = new THREE.Vector3().copy(currentLookAt).add(cameraOffset.clone().multiplyScalar(zoomDistance));
            camera.position.lerp(idealPos, 0.1);
            camera.lookAt(currentLookAt);
            if (showLabels) updateLabels();
            renderer.render(scene, camera);
        }

        function updateLabels() {
            const v = new THREE.Vector3();
            celestialObjects.forEach(function(p) {
                p.mesh.getWorldPosition(v);
                const d = camera.position.distanceTo(v);
                v.project(camera);
                const label = p.label;
                if (v.z > 1) { label.style.display = 'none'; return; }
                const x = (v.x * .5 + .5) * window.innerWidth;
                const y = (v.y * -.5 + .5) * window.innerHeight;
                let limit = 100000000;
                if (p.type === 'satellite') limit = 10000000;
                else if (p.type === 'asteroid') limit = 30000000;
                else if (p.type === 'others') limit = 200000000;
                else if (p.type === 'cosmic') limit = 100000000000;
                else if (p.type === 'supercluster') limit = 50000000000;
                else if (p.type === 'cluster') limit = 10000000000;
                else if (p.type === 'galaxy' || p.type === 'milkyway') limit = 5000000000;
                else if (p.type === 'star') limit = 500000000;
                if (d < limit && d > p.data.size * 0.2) {
                    label.style.display = 'block';
                    label.style.left = x + 'px';
                    label.style.top = y + 'px';
                    label.style.opacity = Math.min(1, (limit / d) * 0.15);
                } else {
                    label.style.display = 'none';
                }
            });
        }

        window.onload = init;
    </script>
</body>
</html>`)
})

export default app
