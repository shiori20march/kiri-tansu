import { useState, useEffect, useRef, useCallback } from "react";

const ITEM_CATEGORIES = ["着物","帯","帯締め","帯揚げ","帯留","小物","上着"];
const KIMONO_TYPES = ["振袖","訪問着","付け下げ","色無地","小紋","紬","浴衣","留袖","その他"];
const OBI_TYPES = ["袋帯","名古屋帯","半幅帯","兵児帯","その他"];
const OBIJIME_TYPES = ["丸組","平組","丸ぐけ","三分紐","細組","その他"];
const OBIAGE_TYPES = ["縮緬","絞り","綸子","絽","紗","その他"];
const OBIDOM_TYPES = ["七宝","花","蝶","鳥","幾何学","アンティーク","その他"];
const KOMON_TYPES = ["草履","バッグ","半衿","重ね衿","その他"];
const UWAGI_TYPES = ["羽織","道行","道中着","チリ除けコート","コート","スカーフ","その他"];
const SEASONS = ["袷","単衣","薄物","その他"];
const KIMONO_SIZE_FIELDS = ["身丈","裄丈","袖丈","前幅","後ろ幅"];
const OBI_SIZE_FIELDS = ["長さ","幅"];

// コーデタグプリセット
const COORD_TAG_PRESETS = ["お茶","観劇","食事会","お稽古","初詣","お花見","結婚式","卒業式","入学式","日常","旅行","撮影","成人式","その他"];

const KIMONO_PATTERNS = [
  {group:"植物",name:"桜",tip:"日本を代表する花。満開前に着るのが粋とされ、散り際の美しさを愛でる日本人の美意識を象徴します。"},
  {group:"植物",name:"梅",tip:"百花の魁（さきがけ）と呼ばれ、寒中に咲く清廉さが尊ばれます。新春から早春に着るのが季節感に合います。"},
  {group:"植物",name:"菊",tip:"長寿・延命の象徴。九月九日の重陽の節句の花で、皇室の紋章にも用いられる高貴な文様です。"},
  {group:"植物",name:"牡丹",tip:"「百花の王」とも呼ばれる華やかな文様。富貴・吉祥を象徴し、格調ある訪問着や振袖に多く使われます。"},
  {group:"植物",name:"藤",tip:"垂れ下がる優美な花房が特徴。五月頃に着るのがふさわしく、平安貴族に愛された雅な文様です。"},
  {group:"植物",name:"紅葉（楓）",tip:"秋の代表的な文様。紅葉が色づく少し前、九月下旬から着始めると季節を先取りした粋な着こなしになります。"},
  {group:"植物",name:"朝顔",tip:"夏の代表的な柄。涼やかな印象を与え、浴衣や夏着物に多く見られます。"},
  {group:"植物",name:"菖蒲",tip:"五月の端午の節句を象徴する文様。勝負・尚武に通じるとされ、凛々しさと気品を表します。"},
  {group:"植物",name:"萩",tip:"秋の七草のひとつ。可憐で風に揺れる姿が風情豊か。"},
  {group:"植物",name:"竹",tip:"まっすぐ伸びる竹は節操・清廉の象徴。松・梅と合わせた「松竹梅」は慶事に用いられる定番の吉祥文様です。"},
  {group:"植物",name:"松",tip:"常緑で長寿の象徴。「松竹梅」の筆頭として礼装着物に頻用される格調高い文様です。"},
  {group:"植物",name:"椿",tip:"冬から早春にかけての花。現代では凛とした美しさで人気です。"},
  {group:"植物",name:"桔梗",tip:"秋の七草のひとつ。古くから家紋にも使われた由緒ある文様で、清楚な五弁の花が特徴的です。"},
  {group:"植物",name:"麻の葉",tip:"六角形を組み合わせた幾何学文様。麻のように丈夫にすくすく育つよう願いを込め、子どもの着物にもよく使われます。"},
  {group:"自然・動物",name:"鶴",tip:"千年の長寿を象徴する瑞鳥。格調高く婚礼衣装や留袖に多用されます。"},
  {group:"自然・動物",name:"蝶",tip:"羽化する蝶は変容・再生の象徴。古来より吉祥文様とされ、振袖や婚礼衣装に華やかさを添えます。"},
  {group:"自然・動物",name:"波（青海波）",tip:"半円を重ねた文様で、穏やかな波が無限に広がるさまは平和と繁栄の象徴。"},
  {group:"自然・動物",name:"雪輪",tip:"雪の結晶を輪の形に図案化した文様。冬の清潔感と優雅さを表します。"},
  {group:"自然・動物",name:"流水",tip:"清らかに流れる水を表現した文様。夏の清涼感を演出します。"},
  {group:"自然・動物",name:"雲（雲取り）",tip:"吉祥や神聖さを象徴する文様。留袖や振袖の裾模様として使われます。"},
  {group:"幾何学・伝統",name:"市松",tip:"二色の正方形を互い違いに並べた文様。江戸時代の歌舞伎俳優・佐野川市松が愛用したことから名付けられました。"},
  {group:"幾何学・伝統",name:"縞",tip:"単純に見えて奥が深い縞文様。江戸時代に庶民に大流行しました。"},
  {group:"幾何学・伝統",name:"格子",tip:"縦横の縞を組み合わせた文様。大島紬や紬着物に多く見られます。"},
  {group:"幾何学・伝統",name:"絣（かすり）",tip:"かすったような独特のにじみが特徴。大島紬・久留米絣などが有名です。"},
  {group:"幾何学・伝統",name:"七宝",tip:"円を四分の一ずつ重ねた文様。縁起の良い吉祥文様です。"},
  {group:"幾何学・伝統",name:"亀甲",tip:"亀の甲羅の六角形を連ねた文様。長寿吉祥の象徴で格調高く、礼装着物にも多く用いられます。"},
  {group:"幾何学・伝統",name:"菱",tip:"菱形を基本とした文様。武家文化と結びつきが深く、多くの派生文様があります。"},
  {group:"幾何学・伝統",name:"紗綾形",tip:"卍（まんじ）を斜めにつないだ文様。「不断長久」を意味する格調ある地紋です。"},
  {group:"吉祥",name:"宝尽くし",tip:"宝珠・打ち出の小槌・巻物など縁起物を散りばめた文様。新年や祝いの場にふさわしい華やかな柄です。"},
  {group:"吉祥",name:"熨斗（のし）",tip:"長くのしたアワビを象徴する文様。祝い事の象徴として礼装着物に多く用いられます。"},
  {group:"吉祥",name:"鳳凰",tip:"吉祥の訪れを告げる想像上の鳥。高貴・繁栄の象徴として留袖・振袖など格式の高い着物に使われます。"},
  {group:"吉祥",name:"貝合わせ",tip:"二枚で一対になる貝の性質から夫婦の契りを象徴。婚礼衣装の定番文様です。"},
  {group:"その他",name:"無地",tip:"無地は帯や小物で個性を表現する引き算の美学。色無地は紋の数で格が変わります。"},
  {group:"その他",name:"その他",tip:"上記以外の柄の場合はこちらを選択し、詳細をメモ欄に記入してください。"},
];
const PATTERN_GROUPS = [...new Set(KIMONO_PATTERNS.map(p=>p.group))];

const FABRIC_DATA = [
  {group:"絹",name:"正絹",tip:"蚕の繭から作られた純粋な絹織物の総称。光沢・肌触り・保温性に優れ、着物の最高級素材とされます。"},
  {group:"絹",name:"羽二重",tip:"経糸・緯糸ともに生糸を使った平織の絹織物。礼装用の長襦袢や胴裏に多く使われます。"},
  {group:"絹",name:"縮緬（ちりめん）",tip:"緯糸に強く撚った糸を使って作るシボ（凹凸）が特徴の絹織物。小紋・留袖など多くの着物に使われます。"},
  {group:"絹",name:"綸子（りんず）",tip:"光沢のある文様が浮き出る絹の繻子織。礼装から普段着まで幅広く使われます。"},
  {group:"絹",name:"紬（つむぎ）",tip:"真綿や節糸を手で紡いだ紬糸を使った織物。大島紬・結城紬が有名。独特の素朴な風合いです。"},
  {group:"絹",name:"お召（おめし）",tip:"経糸に撚糸を用いた先染めの絹織物。シャリ感があり、しなやかです。"},
  {group:"絹",name:"塩瀬（しおぜ）",tip:"経糸を密に打ち込んだ平織りの絹織物。染め名古屋帯の生地として最もよく使われます。"},
  {group:"絹",name:"絽（ろ）",tip:"透け感のある絹織物。夏の礼装・準礼装に用いる代表的な薄物生地です。"},
  {group:"絹",name:"紗（しゃ）",tip:"透け感の強い薄絹。盛夏用の着物や羽織物に使われます。"},
  {group:"絹",name:"絽縮緬",tip:"絽と縮緬を組み合わせた生地。初夏や初秋の単衣に向きます。"},
  {group:"木綿・麻",name:"木綿",tip:"吸水性・通気性に優れた実用的な素材。洗濯機で洗えるものも多いです。"},
  {group:"木綿・麻",name:"麻（上布）",tip:"夏に最適な素材。さらりとした肌触りと清涼感が特徴です。"},
  {group:"木綿・麻",name:"浴衣地（綿紅梅など）",tip:"綿紅梅は縦横の糸を組み合わせて格子状の凹凸を作った浴衣生地。"},
  {group:"化学繊維",name:"ポリエステル",tip:"シワになりにくく洗濯機で洗えるメンテナンス性の高い素材。近年は絹に近い風合いのものも多いです。"},
  {group:"化学繊維",name:"レーヨン",tip:"木材パルプを原料とした再生繊維。絹に似た光沢と柔らかさがあります。"},
  {group:"その他",name:"ウール",tip:"冬の普段着着物として使われる素材。暖かく洗える利便性があります。"},
  {group:"その他",name:"その他",tip:"上記以外の生地の場合はこちらを選択し、詳細をメモ欄に記入してください。"},
];
const FABRIC_GROUPS = [...new Set(FABRIC_DATA.map(f=>f.group))];

// 帯地データ（豆知識付き）
const OBI_FABRIC_DATA = [
  {group:"織り帯地",name:"錦織（にしきおり）",tip:"金銀糸を用いた多色の文様が豪華な織物。袋帯に多く、礼装・準礼装向けの格調高い帯地です。"},
  {group:"織り帯地",name:"唐織（からおり）",tip:"緯糸で文様を浮き立たせた立体感のある織物。能装束にも用いられる格式ある帯地で、振袖・留袖向きです。"},
  {group:"織り帯地",name:"綴織（つづれおり）",tip:"横糸だけで文様を織り出す技法。西陣綴れが有名で、爪で糸を掻き寄せて織る精緻な手仕事。袋帯・名古屋帯に使われます。"},
  {group:"織り帯地",name:"佐賀錦",tip:"金銀箔を薄く切った箔糸を経糸に使う佐賀藩由来の織物。独特の光沢と格調があり、礼装向きです。"},
  {group:"織り帯地",name:"博多織",tip:"福岡・博多が産地の先染め織物。独鈷・華皿を象った独特の縞が特徴で、締め心地が良く浴衣帯から礼装帯まで幅広く使われます。"},
  {group:"織り帯地",name:"西陣織",tip:"京都・西陣で織られる先染めの高級絹織物の総称。多くの種類があり、礼装から普段使いまで格の幅が広い帯地です。"},
  {group:"織り帯地",name:"紬地（つむぎじ）",tip:"紬糸を使って織られた帯地。素朴でざっくりとした風合いが紬着物や小紋と相性よく、カジュアルな装いに向きます。"},
  {group:"染め帯地",name:"塩瀬（しおぜ）",tip:"横畝が特徴の平織り絹。染め名古屋帯の定番生地で、すっきりとした光沢と張りがあり扱いやすい帯地です。"},
  {group:"染め帯地",name:"縮緬（ちりめん）",tip:"シボのある絹織物を染めた帯地。柔らかな風合いが特徴で、染め帯の名古屋帯や付け帯に多く使われます。"},
  {group:"染め帯地",name:"絽（ろ）",tip:"夏用の透け感がある生地を染めたもの。夏の染め帯として絽の名古屋帯が代表的。涼やかな印象を与えます。"},
  {group:"染め帯地",name:"紗（しゃ）",tip:"盛夏用の薄手透け織物を染めた帯地。絽より透け感が強く、最も軽やかな夏帯の生地です。"},
  {group:"その他",name:"麻地",tip:"麻を使った帯地。夏のカジュアルな装いに向き、さらりとした清涼感が魅力です。"},
  {group:"その他",name:"木綿地",tip:"木綿を使った帯地。浴衣帯や半幅帯に多く、洗いやすく普段使いしやすい素材です。"},
  {group:"その他",name:"ポリエステル地",tip:"化学繊維の帯地。シワになりにくく洗いやすいため、普段使いや稽古帯として重宝します。"},
  {group:"その他",name:"その他",tip:"上記以外の帯地の場合はこちらを選択し、詳細をメモ欄に記入してください。"},
];
const OBI_FABRIC_GROUPS = [...new Set(OBI_FABRIC_DATA.map(f=>f.group))];

const TRADITIONAL_COLORS = [
  {name:"紅梅色",bg:"#D75C8B",text:"#fff"},{name:"桜色",bg:"#FEF4F4",text:"#7a4f2e"},
  {name:"薄桜",bg:"#FCDCD5",text:"#7a4f2e"},{name:"珊瑚色",bg:"#F08070",text:"#fff"},
  {name:"茜色",bg:"#9E2A2B",text:"#fff"},{name:"紅色",bg:"#C9193B",text:"#fff"},
  {name:"朱色",bg:"#E55B2D",text:"#fff"},{name:"柿色",bg:"#ED6D3D",text:"#fff"},
  {name:"山吹色",bg:"#F5A800",text:"#fff"},{name:"黄金色",bg:"#C9960C",text:"#fff"},
  {name:"萌黄色",bg:"#6B8E23",text:"#fff"},{name:"若草色",bg:"#8DB255",text:"#fff"},
  {name:"松葉色",bg:"#3D6B45",text:"#fff"},{name:"常磐色",bg:"#1E6B4F",text:"#fff"},
  {name:"浅葱色",bg:"#00A4AC",text:"#fff"},{name:"納戸色",bg:"#4E7B8C",text:"#fff"},
  {name:"藤色",bg:"#9B8EC4",text:"#fff"},{name:"紫苑色",bg:"#8A7BAC",text:"#fff"},
  {name:"江戸紫",bg:"#6B3FA0",text:"#fff"},{name:"紺色",bg:"#1C3A6B",text:"#fff"},
  {name:"藍色",bg:"#1F4E8C",text:"#fff"},{name:"瑠璃色",bg:"#004FA3",text:"#fff"},
  {name:"鶯色",bg:"#6B6529",text:"#fff"},{name:"利休鼠",bg:"#7D8B72",text:"#fff"},
  {name:"焦茶",bg:"#5B3521",text:"#fff"},{name:"弁柄色",bg:"#8B3A2A",text:"#fff"},
];

const todayColor = TRADITIONAL_COLORS[Math.floor(Math.random() * TRADITIONAL_COLORS.length)];

const SETSUKI_LIST = [
  {name:"小寒",month:1,day:6,flower:"寒梅",greeting:"厳寒の候、寒さもひとしお身にしみる頃となりました。",pattern:"松・竹・梅・雪輪・氷菊"},
  {name:"大寒",month:1,day:20,flower:"蝋梅・福寿草",greeting:"大寒の候、一年で最も寒い時期を迎えております。",pattern:"雪持ち柳・椿・雪輪"},
  {name:"立春",month:2,day:4,flower:"梅・水仙",greeting:"立春の候、春の訪れを感じる季節となりました。",pattern:"梅・松竹梅・春霞"},
  {name:"雨水",month:2,day:19,flower:"菜の花・猫柳",greeting:"雨水の候、雪も雨へと変わり始める頃となりました。",pattern:"梅・菜の花・春霞"},
  {name:"啓蟄",month:3,day:6,flower:"木蓮・タンポポ",greeting:"啓蟄の候、虫も目覚める春めいた季節となりました。",pattern:"蝶・桜・春草"},
  {name:"春分",month:3,day:21,flower:"桜・春蘭",greeting:"春分の候、春光うららかな季節となりました。",pattern:"桜・蝶・貝合わせ"},
  {name:"清明",month:4,day:5,flower:"桜・山吹",greeting:"清明の候、花々が一斉に咲き誇る季節となりました。",pattern:"藤・桜吹雪・流水"},
  {name:"穀雨",month:4,day:20,flower:"藤・牡丹",greeting:"穀雨の候、春の雨に万物が潤う季節となりました。",pattern:"藤・牡丹・鞠"},
  {name:"立夏",month:5,day:6,flower:"菖蒲・藤",greeting:"立夏の候、青葉若葉の清々しい季節となりました。",pattern:"菖蒲・葵・紗綾形"},
  {name:"小満",month:5,day:21,flower:"卯の花・撫子",greeting:"小満の候、草木が生い茂る季節となりました。",pattern:"撫子・麻の葉・絽の単衣"},
  {name:"芒種",month:6,day:6,flower:"紫陽花・花菖蒲",greeting:"芒種の候、梅雨の季節を迎えております。",pattern:"紫陽花・流水・柳"},
  {name:"夏至",month:6,day:21,flower:"紫陽花・山百合",greeting:"夏至の候、一年で昼の最も長い季節となりました。",pattern:"朝顔・金魚・流水"},
  {name:"小暑",month:7,day:7,flower:"朝顔・向日葵",greeting:"小暑の候、暑さが日増しに厳しくなってまいりました。",pattern:"朝顔・花火・波"},
  {name:"大暑",month:7,day:23,flower:"向日葵・蓮",greeting:"大暑の候、酷暑の毎日が続いております。",pattern:"蓮・金魚・花火・麻の葉"},
  {name:"立秋",month:8,day:7,flower:"桔梗・萩",greeting:"立秋の候、暦の上では秋を迎えました。",pattern:"桔梗・萩・秋草"},
  {name:"処暑",month:8,day:23,flower:"葛・秋桜",greeting:"処暑の候、暑さも峠を越した頃となりました。",pattern:"萩・桔梗・秋の七草"},
  {name:"白露",month:9,day:8,flower:"萩・彼岸花",greeting:"白露の候、朝夕の涼しさが感じられる季節となりました。",pattern:"菊・紅葉・秋草"},
  {name:"秋分",month:9,day:23,flower:"彼岸花・竜胆",greeting:"秋分の候、秋も深まり色づく季節となりました。",pattern:"菊・紅葉・楓"},
  {name:"寒露",month:10,day:8,flower:"菊・コスモス",greeting:"寒露の候、秋の深まりを肌で感じる季節となりました。",pattern:"菊・紅葉・鹿"},
  {name:"霜降",month:10,day:23,flower:"菊・山茶花",greeting:"霜降の候、朝夕はめっきり冷え込む季節となりました。",pattern:"菊・紅葉・枯れ野"},
  {name:"立冬",month:11,day:7,flower:"山茶花・茶の花",greeting:"立冬の候、暦の上では冬を迎えました。",pattern:"椿・松・吉祥文様"},
  {name:"小雪",month:11,day:22,flower:"山茶花・南天",greeting:"小雪の候、北の地方では雪の便りも届く頃となりました。",pattern:"雪輪・松・椿"},
  {name:"大雪",month:12,day:7,flower:"寒椿・南天",greeting:"大雪の候、山々も白く雪化粧する季節となりました。",pattern:"雪持ち松・椿・松竹梅"},
  {name:"冬至",month:12,day:22,flower:"寒椿・蝋梅",greeting:"冬至の候、一年で最も夜が長い季節となりました。",pattern:"雪輪・松竹梅・宝尽くし"},
];

function getTodaySetsuki() {
  const now=new Date(), m=now.getMonth()+1, d=now.getDate();
  let curIdx=SETSUKI_LIST.length-1;
  for (let i=0;i<SETSUKI_LIST.length;i++) {
    const s=SETSUKI_LIST[i];
    if(m>s.month||(m===s.month&&d>=s.day)) curIdx=i; else break;
  }
  return curIdx;
}

// 現在の節気インデックスを基準にランダム（同節気内の別フレーズ感を出すため、
// 前後1節気の範囲でランダムに選ぶ）
// 各節気に複数バリエーションを追加定義（開くたびにランダム選択）
const SETSUKI_VARIATIONS = {
  "小寒": [
    {flower:"寒梅", greeting:"厳寒の候、寒さもひとしお身にしみる頃となりました。", pattern:"松・竹・梅・雪輪"},
    {flower:"水仙", greeting:"寒の入りを迎え、清澄な空気の中に春の予感を感じます。", pattern:"水仙・氷菊・松竹梅"},
  ],
  "大寒": [
    {flower:"蝋梅・福寿草", greeting:"大寒の候、一年で最も寒い時期を迎えております。", pattern:"雪持ち柳・椿・雪輪"},
    {flower:"蝋梅", greeting:"寒気凛冽の折、蝋梅の香りに春の兆しを感じます。", pattern:"梅・雪持ち松・宝尽くし"},
  ],
  "立春": [
    {flower:"梅・水仙", greeting:"立春の候、春の訪れを感じる季節となりました。", pattern:"梅・松竹梅・春霞"},
    {flower:"福寿草", greeting:"春立つとは名ばかりの寒さですが、草木が芽吹き始める頃です。", pattern:"梅・春霞・蝶"},
  ],
  "雨水": [
    {flower:"菜の花・猫柳", greeting:"雨水の候、雪も雨へと変わり始める頃となりました。", pattern:"梅・菜の花・春霞"},
    {flower:"菜の花", greeting:"春雨がそっと大地を潤し始める頃となりました。", pattern:"春草・水仙・鶯"},
  ],
  "啓蟄": [
    {flower:"木蓮・タンポポ", greeting:"啓蟄の候、虫も目覚める春めいた季節となりました。", pattern:"蝶・桜・春草"},
    {flower:"土筆・菫", greeting:"土の中の虫も目を覚ます、春めいた季節です。", pattern:"蝶・土筆・霞"},
  ],
  "春分": [
    {flower:"桜・春蘭", greeting:"春分の候、春光うららかな季節となりました。", pattern:"桜・蝶・貝合わせ"},
    {flower:"桜", greeting:"昼と夜の長さが等しくなり、いよいよ春本番です。", pattern:"桜・流水・鞠"},
  ],
  "清明": [
    {flower:"桜・山吹", greeting:"清明の候、花々が一斉に咲き誇る季節となりました。", pattern:"藤・桜吹雪・流水"},
    {flower:"山吹・躑躅", greeting:"清らかで明るい春の気に満ちた頃となりました。", pattern:"山吹・桜吹雪・蝶"},
  ],
  "穀雨": [
    {flower:"藤・牡丹", greeting:"穀雨の候、春の雨に万物が潤う季節となりました。", pattern:"藤・牡丹・鞠"},
    {flower:"藤", greeting:"春雨が穀物を育てる恵みの季節を迎えました。", pattern:"藤・青海波・熨斗"},
  ],
  "立夏": [
    {flower:"菖蒲・藤", greeting:"立夏の候、青葉若葉の清々しい季節となりました。", pattern:"菖蒲・葵・紗綾形"},
    {flower:"卯の花", greeting:"暦の上では夏を迎え、若葉の薫りが心地よい季節です。", pattern:"菖蒲・流水・鱗"},
  ],
  "小満": [
    {flower:"卯の花・撫子", greeting:"小満の候、草木が生い茂る季節となりました。", pattern:"撫子・麻の葉・絽の単衣"},
    {flower:"杜若", greeting:"万物が満ち足りる小満の頃、自然の豊かさを感じます。", pattern:"杜若・流水・麻の葉"},
  ],
  "芒種": [
    {flower:"紫陽花・花菖蒲", greeting:"芒種の候、梅雨の季節を迎えております。", pattern:"紫陽花・流水・柳"},
    {flower:"紫陽花", greeting:"雨音に風情を感じる、梅雨の季節となりました。", pattern:"雨・柳・紫陽花・流水"},
  ],
  "夏至": [
    {flower:"紫陽花・山百合", greeting:"夏至の候、一年で昼の最も長い季節となりました。", pattern:"朝顔・金魚・流水"},
    {flower:"半夏生", greeting:"一年で最も日の長い夏至を迎えました。", pattern:"流水・青海波・朝顔"},
  ],
  "小暑": [
    {flower:"朝顔・向日葵", greeting:"小暑の候、暑さが日増しに厳しくなってまいりました。", pattern:"朝顔・花火・波"},
    {flower:"睡蓮", greeting:"本格的な夏の暑さが始まる頃となりました。", pattern:"金魚・波・花火・朝顔"},
  ],
  "大暑": [
    {flower:"向日葵・蓮", greeting:"大暑の候、酷暑の毎日が続いております。", pattern:"蓮・金魚・花火・麻の葉"},
    {flower:"蓮", greeting:"一年で最も暑い大暑の頃、涼を求める装いで。", pattern:"青海波・氷・流水・蓮"},
  ],
  "立秋": [
    {flower:"桔梗・萩", greeting:"立秋の候、暦の上では秋を迎えました。", pattern:"桔梗・萩・秋草"},
    {flower:"桔梗", greeting:"残暑厳しい折ですが、暦の上では秋となりました。", pattern:"秋草・桔梗・流水"},
  ],
  "処暑": [
    {flower:"葛・秋桜", greeting:"処暑の候、暑さも峠を越した頃となりました。", pattern:"萩・桔梗・秋の七草"},
    {flower:"芙蓉", greeting:"朝夕に秋の涼しさを感じるようになった頃です。", pattern:"秋桜・萩・野菊"},
  ],
  "白露": [
    {flower:"萩・彼岸花", greeting:"白露の候、朝夕の涼しさが感じられる季節となりました。", pattern:"菊・紅葉・秋草"},
    {flower:"白萩", greeting:"草木に白露が宿り、秋の深まりを感じます。", pattern:"菊・雁・秋の七草"},
  ],
  "秋分": [
    {flower:"彼岸花・竜胆", greeting:"秋分の候、秋も深まり色づく季節となりました。", pattern:"菊・紅葉・楓"},
    {flower:"秋桜", greeting:"昼と夜が等しくなり、秋の静けさが心に沁みます。", pattern:"紅葉・楓・松虫草"},
  ],
  "寒露": [
    {flower:"菊・コスモス", greeting:"寒露の候、秋の深まりを肌で感じる季節となりました。", pattern:"菊・紅葉・鹿"},
    {flower:"龍胆", greeting:"冷たい露が草木に宿る頃、秋が深まってまいりました。", pattern:"菊・枯れ野・雁"},
  ],
  "霜降": [
    {flower:"菊・山茶花", greeting:"霜降の候、朝夕はめっきり冷え込む季節となりました。", pattern:"菊・紅葉・枯れ野"},
    {flower:"菊", greeting:"霜が降り始め、木々が美しく色づく季節となりました。", pattern:"紅葉・菊・市松"},
  ],
  "立冬": [
    {flower:"山茶花・茶の花", greeting:"立冬の候、暦の上では冬を迎えました。", pattern:"椿・松・吉祥文様"},
    {flower:"茶の花", greeting:"冬の扉が開く頃、凛とした空気に心が引き締まります。", pattern:"松・吉祥・七宝"},
  ],
  "小雪": [
    {flower:"山茶花・南天", greeting:"小雪の候、北の地方では雪の便りも届く頃となりました。", pattern:"雪輪・松・椿"},
    {flower:"南天", greeting:"小さな雪が舞い始め、冬の深まりを感じます。", pattern:"雪持ち柳・椿・松"},
  ],
  "大雪": [
    {flower:"寒椿・南天", greeting:"大雪の候、山々も白く雪化粧する季節となりました。", pattern:"雪持ち松・椿・松竹梅"},
    {flower:"寒椿", greeting:"雪が本格的に降り積もる頃となりました。", pattern:"雪輪・雪持ち松・吉祥"},
  ],
  "冬至": [
    {flower:"寒椿・蝋梅", greeting:"冬至の候、一年で最も夜が長い季節となりました。", pattern:"雪輪・松竹梅・宝尽くし"},
    {flower:"蝋梅", greeting:"冬至を境に陽が戻り始めます。一陽来復の節目です。", pattern:"松竹梅・宝尽くし・鶴亀"},
  ],
};

function getRandomSetsuki() {
  const curIdx = getTodaySetsuki();
  const base = SETSUKI_LIST[curIdx];
  const variations = SETSUKI_VARIATIONS[base.name];
  if (variations && variations.length > 0) {
    const v = variations[Math.floor(Math.random() * variations.length)];
    return { ...base, ...v };
  }
  return base;
}

const kujiToCm=v=>v?String(Math.round(parseFloat(v)*37.88/10*10)/10):"";
const cmToKuji=v=>v?String(Math.round(parseFloat(v)/37.88*10*100)/100):"";
function convertSize(val,from,to){if(!val||from===to)return val||"";return from==="鯨尺"?kujiToCm(val):cmToKuji(val);}

// ── ストレージヘルパー（localStorage版） ───────────────────
// 写真（base64）は容量が大きいので個別キーで保存
function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch(e) {
    // QuotaExceededError: 古い写真キャッシュを削除して再試行
    if (e.name === "QuotaExceededError" || e.code === 22) {
      console.warn("localStorage quota exceeded, clearing old photos...");
      const keys = Object.keys(localStorage).filter(k =>
        k.startsWith("kiri_photo_") || k.startsWith("kiri_kisugat_")
      );
      // 半分消して再試行
      keys.slice(0, Math.ceil(keys.length / 2)).forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });
      try { localStorage.setItem(key, value); return true; } catch { return false; }
    }
    return false;
  }
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch {}
}

async function loadAllItems() {
  try {
    const raw = lsGet("kiri_meta");
    if (!raw) return [];
    const metas = JSON.parse(raw);
    return metas.map(meta => {
      const photo = lsGet("kiri_photo_" + meta.id);
      return { ...meta, photo };
    });
  } catch { return []; }
}

async function saveAllItems(items) {
  const metas = items.map(({ photo, ...meta }) => meta);
  lsSet("kiri_meta", JSON.stringify(metas));
  for (const item of items) {
    if (item.photo) lsSet("kiri_photo_" + item.id, item.photo);
  }
  // 削除されたアイテムの写真を掃除
  const ids = new Set(items.map(it => String(it.id)));
  Object.keys(localStorage)
    .filter(k => k.startsWith("kiri_photo_"))
    .forEach(k => {
      const id = k.replace("kiri_photo_", "");
      if (!ids.has(id)) lsRemove(k);
    });
}

async function loadCoords() {
  try {
    const raw = lsGet("kiri_coords");
    if (!raw) return [];
    const coords = JSON.parse(raw);
    return coords.map(c => {
      const kisugatPhoto = lsGet("kiri_kisugat_" + c.id);
      return { ...c, kisugatPhoto };
    });
  } catch { return []; }
}

async function saveCoords(coords) {
  const metas = coords.map(({ kisugatPhoto, ...c }) => c);
  lsSet("kiri_coords", JSON.stringify(metas));
  for (const c of coords) {
    if (c.kisugatPhoto) lsSet("kiri_kisugat_" + c.id, c.kisugatPhoto);
  }
}

async function deleteCoordById(id, coords) {
  const nc = coords.filter(c => c.id !== id);
  await saveCoords(nc);
  lsRemove("kiri_kisugat_" + id);
  return nc;
}

// 着用履歴の読み書き
async function loadWearHistory() {
  try {
    const raw = lsGet("kiri_wear_history");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}
async function saveWearHistory(history) {
  lsSet("kiri_wear_history", JSON.stringify(history));
}

// ── 桐箪笥SVG ──────────────────────────────────────────────
function TansuSVG({ size=36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="88" width="10" height="10" rx="2" fill="#8B5E3C"/>
      <rect x="72" y="88" width="10" height="10" rx="2" fill="#8B5E3C"/>
      <rect x="10" y="10" width="80" height="80" rx="4" fill="#C8943A"/>
      <rect x="10" y="10" width="80" height="80" rx="4" stroke="#7A4F2E" strokeWidth="2.5"/>
      <line x1="10" y1="22" x2="90" y2="22" stroke="#A07530" strokeWidth="1"/>
      <line x1="10" y1="55" x2="90" y2="55" stroke="#7A4F2E" strokeWidth="2"/>
      <line x1="10" y1="68" x2="90" y2="68" stroke="#A07530" strokeWidth="1"/>
      <rect x="14" y="26" width="72" height="25" rx="2" fill="#D4A045" stroke="#7A4F2E" strokeWidth="1.5"/>
      <ellipse cx="50" cy="38.5" rx="8" ry="4" fill="none" stroke="#7A4F2E" strokeWidth="2"/>
      <rect x="46" y="37" width="8" height="3" rx="1.5" fill="#C0A060"/>
      <rect x="14" y="58" width="33" height="19" rx="2" fill="#D4A045" stroke="#7A4F2E" strokeWidth="1.5"/>
      <ellipse cx="30" cy="67.5" rx="5" ry="3" fill="none" stroke="#7A4F2E" strokeWidth="1.8"/>
      <rect x="27" y="66" width="6" height="3" rx="1.5" fill="#C0A060"/>
      <rect x="53" y="58" width="33" height="19" rx="2" fill="#D4A045" stroke="#7A4F2E" strokeWidth="1.5"/>
      <ellipse cx="69" cy="67.5" rx="5" ry="3" fill="none" stroke="#7A4F2E" strokeWidth="1.8"/>
      <rect x="66" y="66" width="6" height="3" rx="1.5" fill="#C0A060"/>
      <rect x="11" y="11" width="8" height="8" rx="1" fill="#D4AF37" opacity="0.9"/>
      <rect x="81" y="11" width="8" height="8" rx="1" fill="#D4AF37" opacity="0.9"/>
      <rect x="11" y="81" width="8" height="8" rx="1" fill="#D4AF37" opacity="0.9"/>
      <rect x="81" y="81" width="8" height="8" rx="1" fill="#D4AF37" opacity="0.9"/>
    </svg>
  );
}

// ── Cropper ──────────────────────────────────────────────────
function Cropper({ src, onDone, onCancel }) {
  const canvasRef=useRef(), imgRef=useRef();
  const [drag,setDrag]=useState(null);
  const [box,setBox]=useState({x:40,y:40,w:260,h:260});
  const [loaded,setLoaded]=useState(false);
  const cw=320, ch=420;
  const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));

  const draw=useCallback(()=>{
    const cv=canvasRef.current, img=imgRef.current;
    if(!cv||!img||!loaded) return;
    const ctx=cv.getContext("2d");
    ctx.clearRect(0,0,cw,ch);
    ctx.drawImage(img,0,0,cw,ch);
    ctx.fillStyle="rgba(0,0,0,0.5)"; ctx.fillRect(0,0,cw,ch);
    ctx.clearRect(box.x,box.y,box.w,box.h);
    ctx.drawImage(img,(box.x/cw)*img.naturalWidth,(box.y/ch)*img.naturalHeight,(box.w/cw)*img.naturalWidth,(box.h/ch)*img.naturalHeight,box.x,box.y,box.w,box.h);
    ctx.strokeStyle="#c8a882"; ctx.lineWidth=2; ctx.strokeRect(box.x,box.y,box.w,box.h);
    ctx.strokeStyle="rgba(255,255,255,0.3)"; ctx.lineWidth=1;
    [1,2].forEach(n=>{
      ctx.beginPath(); ctx.moveTo(box.x+box.w*n/3,box.y); ctx.lineTo(box.x+box.w*n/3,box.y+box.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(box.x,box.y+box.h*n/3); ctx.lineTo(box.x+box.w,box.y+box.h*n/3); ctx.stroke();
    });
    [[box.x,box.y],[box.x+box.w,box.y],[box.x,box.y+box.h],[box.x+box.w,box.y+box.h]].forEach(([hx,hy])=>{
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(hx,hy,7,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#8b5e3c"; ctx.lineWidth=2; ctx.stroke();
    });
  },[box,loaded]);
  useEffect(()=>{draw();},[draw]);

  const getPos=(e,cv)=>{const r=cv.getBoundingClientRect(),cl=e.touches?e.touches[0]:e;return{x:(cl.clientX-r.left)*(cw/r.width),y:(cl.clientY-r.top)*(ch/r.height)};};
  const hitHandle=pos=>[{id:"tl",x:box.x,y:box.y},{id:"tr",x:box.x+box.w,y:box.y},{id:"bl",x:box.x,y:box.y+box.h},{id:"br",x:box.x+box.w,y:box.y+box.h}].find(c=>Math.hypot(c.x-pos.x,c.y-pos.y)<16)||null;
  const onDown=e=>{
    e.preventDefault(); const pos=getPos(e,canvasRef.current), h=hitHandle(pos);
    if(h){setDrag({type:"handle",id:h.id,startBox:{...box}});return;}
    if(pos.x>box.x&&pos.x<box.x+box.w&&pos.y>box.y&&pos.y<box.y+box.h){setDrag({type:"move",ox:pos.x-box.x,oy:pos.y-box.y});return;}
    setDrag({type:"new",sx:pos.x,sy:pos.y});
  };
  const onMove=e=>{
    if(!drag)return; e.preventDefault(); const pos=getPos(e,canvasRef.current);
    if(drag.type==="move") setBox(b=>({...b,x:clamp(pos.x-drag.ox,0,cw-b.w),y:clamp(pos.y-drag.oy,0,ch-b.h)}));
    else if(drag.type==="new"){const x=Math.min(pos.x,drag.sx),y=Math.min(pos.y,drag.sy),w=Math.abs(pos.x-drag.sx),h=Math.abs(pos.y-drag.sy);if(w>10&&h>10)setBox({x:clamp(x,0,cw),y:clamp(y,0,ch),w:clamp(w,10,cw-x),h:clamp(h,10,ch-y)});}
    else if(drag.type==="handle"){
      const sb=drag.startBox;
      setBox(()=>{
        if(drag.id==="tl"){const nx=clamp(pos.x,0,sb.x+sb.w-30),ny=clamp(pos.y,0,sb.y+sb.h-30);return{x:nx,y:ny,w:sb.x+sb.w-nx,h:sb.y+sb.h-ny};}
        if(drag.id==="tr"){const ny=clamp(pos.y,0,sb.y+sb.h-30);return{x:sb.x,y:ny,w:clamp(pos.x-sb.x,30,cw-sb.x),h:sb.y+sb.h-ny};}
        if(drag.id==="bl"){const nx=clamp(pos.x,0,sb.x+sb.w-30);return{x:nx,y:sb.y,w:sb.x+sb.w-nx,h:clamp(pos.y-sb.y,30,ch-sb.y)};}
        return{x:sb.x,y:sb.y,w:clamp(pos.x-sb.x,30,cw-sb.x),h:clamp(pos.y-sb.y,30,ch-sb.y)};
      });
    }
  };
  const onUp=()=>setDrag(null);

  const crop=()=>{
    const img=imgRef.current;
    const scaleX=img.naturalWidth/cw, scaleY=img.naturalHeight/ch;
    const sx=box.x*scaleX, sy=box.y*scaleY, sw=box.w*scaleX, sh=box.h*scaleY;
    const maxOut=1600;
    const outW=Math.min(sw,maxOut), outH=Math.round(sh*(outW/sw));
    const out=document.createElement("canvas");
    out.width=outW; out.height=outH;
    out.getContext("2d").drawImage(img,sx,sy,sw,sh,0,0,outW,outH);
    onDone(out.toDataURL("image/jpeg",0.92));
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:12}}>
      <div style={{background:"#fff",borderRadius:14,padding:14,width:"100%",maxWidth:360}}>
        <div style={{fontWeight:"bold",color:"#7a4f2e",marginBottom:6,fontSize:16}}>📐 トリミング</div>
        <p style={{fontSize:11,color:"#b89a7a",marginBottom:8}}>枠をドラッグして範囲を選択してください</p>
        <canvas ref={canvasRef} width={cw} height={ch}
          style={{width:"100%",borderRadius:8,cursor:"crosshair",touchAction:"none",display:"block"}}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}/>
        <img ref={imgRef} src={src} style={{display:"none"}} onLoad={()=>setLoaded(true)} alt=""/>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button onClick={crop} style={{flex:1,padding:10,background:"#8b5e3c",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:"bold",fontSize:14}}>切り抜く</button>
          <button onClick={onCancel} style={{flex:1,padding:10,background:"#e8d5c0",color:"#7a4f2e",border:"none",borderRadius:8,cursor:"pointer",fontSize:14}}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

function PhotoUpload({ value, onChange, height=180 }) {
  const ref=useRef(); const [cropSrc,setCropSrc]=useState(null);
  return (<>
    <div onClick={()=>ref.current.click()} style={{width:"100%",height,border:"2px dashed #c8a882",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",background:"#fdf8f3"}}>
      {value?<img src={value} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{color:"#b89a7a",fontSize:40}}>📷</span>}
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setCropSrc(ev.target.result);r.readAsDataURL(f);}}/>
    </div>
    {cropSrc&&<Cropper src={cropSrc} onDone={d=>{onChange(d);setCropSrc(null);}} onCancel={()=>setCropSrc(null)}/>}
  </>);
}

// ── 柄・生地 選択モーダル ────────────────────────────────────
function SelectWithTipModal({ title, groups, data, value, onChange, onClose }) {
  const [activeGroup, setActiveGroup] = useState(groups[0]);
  const [hoveredTip, setHoveredTip] = useState(null);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:"16px 16px 0 0",width:"100%",maxWidth:480,maxHeight:"80vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"14px 16px 10px",borderBottom:"1px solid #eddcc8",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontWeight:"bold",fontSize:16,color:"#7a4f2e"}}>{title}を選ぶ</span>
          <button onClick={onClose} style={{border:"none",background:"transparent",fontSize:20,cursor:"pointer",color:"#b89a7a"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:4,padding:"8px 12px",overflowX:"auto",flexShrink:0}}>
          {groups.map(g=>(
            <button key={g} onClick={()=>setActiveGroup(g)}
              style={{padding:"4px 12px",borderRadius:16,border:"1px solid #c8a882",background:activeGroup===g?"#8b5e3c":"transparent",color:activeGroup===g?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {g}
            </button>
          ))}
        </div>
        {hoveredTip && (
          <div style={{margin:"0 12px 6px",padding:"8px 12px",background:"#fff9f0",border:"1px solid #e8d5b0",borderRadius:8,fontSize:12,color:"#5a3a1a",lineHeight:1.6}}>
            💡 {hoveredTip}
          </div>
        )}
        <div style={{overflowY:"auto",flex:1,padding:"4px 12px 16px"}}>
          {data.filter(d=>d.group===activeGroup).map(d=>(
            <div key={d.name}
              onMouseEnter={()=>setHoveredTip(d.tip)}
              onTouchStart={()=>setHoveredTip(d.tip)}
              onClick={()=>{onChange(d.name);onClose();}}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:8,marginBottom:6,background:value===d.name?"#f0dfc8":"#fdf8f2",border:`1.5px solid ${value===d.name?"#c8a882":"#eddcc8"}`,cursor:"pointer"}}>
              <div>
                <div style={{fontWeight:"bold",fontSize:14,color:"#4a3020"}}>{d.name}</div>
                <div style={{fontSize:11,color:"#a08060",marginTop:2,lineHeight:1.4}}>{d.tip.slice(0,40)}…</div>
              </div>
              {value===d.name && <span style={{color:"#c8a882",fontSize:18,flexShrink:0}}>✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── サイズ ──────────────────────────────────────────────────
function SizeFields({category,sizes,setSizes,unit,setUnit}) {
  const fields=category==="着物"?KIMONO_SIZE_FIELDS:category==="帯"?OBI_SIZE_FIELDS:null;
  if(!fields) return null;
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <label style={{fontSize:15,color:"#8b6a50",fontWeight:"bold"}}>サイズ</label>
        <div style={{display:"flex",gap:4}}>
          {["cm","鯨尺"].map(u=>(
            <button key={u} onClick={()=>setUnit(u)} style={{padding:"4px 12px",borderRadius:12,border:"1px solid #c8a882",background:u===unit?"#8b5e3c":"transparent",color:u===unit?"#fff":"#7a4f2e",fontSize:13,cursor:"pointer"}}>{u}</button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {fields.map(f=>(
          <div key={f}>
            <label style={{fontSize:13,color:"#b89a7a",display:"block",marginBottom:3}}>{f}（{unit}）</label>
            <input type="number" step="0.1" value={sizes[f]||""} onChange={e=>setSizes(p=>({...p,[f]:e.target.value}))}
              placeholder={unit==="cm"?"例:163":"例:4.3"}
              style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #c8a882",fontSize:14,boxSizing:"border-box"}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function SizeDisplay({category,sizes,savedUnit}) {
  const [dispUnit,setDispUnit]=useState(savedUnit||"cm");
  const fields=category==="着物"?KIMONO_SIZE_FIELDS:category==="帯"?OBI_SIZE_FIELDS:null;
  if(!fields||!sizes||!Object.values(sizes).some(v=>v)) return null;
  return (
    <div style={{marginTop:8}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
        <span style={{fontSize:13,color:"#b89a7a"}}>サイズ</span>
        {["cm","鯨尺"].map(u=>(
          <button key={u} onClick={()=>setDispUnit(u)} style={{padding:"2px 10px",borderRadius:10,border:"1px solid #c8a882",background:u===dispUnit?"#8b5e3c":"transparent",color:u===dispUnit?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer"}}>{u}</button>
        ))}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {fields.map(f=>sizes[f]?(
          <span key={f} style={{fontSize:13,background:"#f0e0cc",borderRadius:6,padding:"3px 8px",color:"#4a3020"}}>
            {f}: {convertSize(sizes[f],savedUnit||"cm",dispUnit)}{dispUnit}
          </span>
        ):null)}
      </div>
    </div>
  );
}

// ── 着用履歴モーダル ─────────────────────────────────────────
function WearHistoryModal({ item, history, onClose, onAdd, onDelete }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState("");
  const itemHistory = history.filter(h => h.itemId === item.id).sort((a,b) => b.date.localeCompare(a.date));

  const handleAdd = () => {
    if (!date) return;
    onAdd({ id: Date.now(), itemId: item.id, date, note });
    setNote("");
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:420,maxHeight:"88vh",overflowY:"auto",padding:20}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontWeight:"bold",fontSize:16,color:"#7a4f2e"}}>👘 着用履歴</div>
            <div style={{fontSize:13,color:"#b89a7a",marginTop:2}}>{item.name}</div>
          </div>
          <button onClick={onClose} style={{border:"none",background:"transparent",fontSize:22,cursor:"pointer",color:"#b89a7a"}}>✕</button>
        </div>

        {/* 着用回数バッジ */}
        <div style={{background:"linear-gradient(135deg,#f0dfc8,#e8c9a0)",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:32,fontWeight:"bold",color:"#7a4f2e"}}>{itemHistory.length}</div>
            <div style={{fontSize:12,color:"#b89a7a"}}>回着用</div>
          </div>
          {itemHistory.length > 0 && (
            <div style={{fontSize:13,color:"#7a4f2e"}}>
              <div>最終着用：{itemHistory[0].date}</div>
              {itemHistory.length >= 5 && <div style={{marginTop:4,color:"#8b5e3c",fontWeight:"bold"}}>🌟 よく着るお気に入り！</div>}
            </div>
          )}
        </div>

        {/* 着用日追加 */}
        <div style={{background:"#fdf8f2",borderRadius:10,padding:14,marginBottom:16,border:"1px solid #eddcc8"}}>
          <div style={{fontSize:14,fontWeight:"bold",color:"#7a4f2e",marginBottom:10}}>＋ 着用日を記録</div>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{width:"100%",padding:"9px",borderRadius:8,border:"1px solid #c8a882",fontSize:15,marginBottom:8,boxSizing:"border-box"}}/>
          <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="メモ（例：友人の結婚式）"
            style={{width:"100%",padding:"9px",borderRadius:8,border:"1px solid #c8a882",fontSize:14,marginBottom:10,boxSizing:"border-box"}}/>
          <button onClick={handleAdd} style={{width:"100%",padding:10,background:"#8b5e3c",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:"bold",fontSize:14}}>記録する</button>
        </div>

        {/* 履歴リスト */}
        <div style={{fontSize:14,fontWeight:"bold",color:"#7a4f2e",marginBottom:8}}>着用履歴</div>
        {itemHistory.length === 0 ? (
          <div style={{textAlign:"center",color:"#b89a7a",padding:20,fontSize:14}}>まだ着用記録がありません</div>
        ) : (
          itemHistory.map((h,i) => (
            <div key={h.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:i%2===0?"#fdf8f2":"#fff",borderRadius:8,marginBottom:6,border:"1px solid #eddcc8"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,color:"#4a3020",fontWeight:"bold"}}>{h.date}</div>
                {h.note && <div style={{fontSize:12,color:"#8b6a50",marginTop:2}}>{h.note}</div>}
              </div>
              <button onClick={()=>onDelete(h.id)} style={{border:"none",background:"transparent",color:"#e57373",fontSize:16,cursor:"pointer",padding:4}}>🗑</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── 詳細モーダル（着用履歴ボタン追加） ──────────────────────
function DetailModal({detail, onClose, onEdit, onDelete, onWearHistory, wearCount, C}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };
  const handleDeleteConfirm = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
    onDelete();
  };
  const handleDeleteCancel = (e) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto",padding:20}} onClick={e=>e.stopPropagation()}>
        {detail.photo&&<img src={detail.photo} alt="" style={{width:"100%",height:220,objectFit:"cover",borderRadius:10,marginBottom:14}}/>}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div style={{fontWeight:"bold",fontSize:20,color:C.header,flex:1}}>{detail.name}</div>
          {wearCount > 0 && (
            <div style={{flexShrink:0,background:"#f0dfc8",borderRadius:20,padding:"3px 12px",fontSize:13,color:"#7a4f2e",fontWeight:"bold",marginLeft:8}}>
              👘 {wearCount}回
            </div>
          )}
        </div>
        {[["カテゴリ",detail.category],["種類",detail.type],["季節",detail.season],["色",detail.color],["柄",detail.pattern],["生地",detail.fabric],["メモ",detail.memo]].map(([k,v])=>v?(
          <div key={k} style={{display:"flex",gap:8,marginBottom:7,fontSize:15}}>
            <span style={{color:"#b89a7a",width:56,flexShrink:0}}>{k}</span>
            <span style={{color:"#4a3020"}}>{v}</span>
          </div>
        ):null)}
        <SizeDisplay category={detail.category} sizes={detail.sizes} savedUnit={detail.sizeUnit}/>

        {/* 削除確認UI（インライン） */}
        {confirmDelete && (
          <div style={{marginTop:14,padding:"12px 14px",background:"#fff0f0",borderRadius:10,border:"1px solid #f5c6c6"}}>
            <div style={{fontSize:14,color:"#c62828",fontWeight:"bold",marginBottom:10}}>本当に削除しますか？</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleDeleteConfirm} style={{flex:1,padding:10,background:"#e57373",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:"bold",fontSize:14}}>削除する</button>
              <button onClick={handleDeleteCancel} style={{flex:1,padding:10,background:"#eee",color:"#555",border:"none",borderRadius:8,cursor:"pointer",fontSize:14}}>キャンセル</button>
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          <button onClick={onWearHistory} style={{flex:1,padding:11,background:"#c8943a",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,minWidth:80}}>📅 着用履歴</button>
          <button onClick={onEdit} style={{flex:1,padding:11,background:C.btn,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,minWidth:80}}>編集</button>
          <button onClick={handleDeleteClick} style={{flex:1,padding:11,background:"#e57373",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,minWidth:80}}>削除</button>
          <button onClick={onClose} style={{flex:1,padding:11,background:C.btnLight,color:C.header,border:"none",borderRadius:8,cursor:"pointer",fontSize:14,minWidth:80}}>閉じる</button>
        </div>
      </div>
    </div>
  );
}

// ── 登録フォーム ─────────────────────────────────────────────
function AddForm({form,setForm,formSizes,setFormSizes,formSizeUnit,setFormSizeUnit,editId,submitItem,typeOpts,C,onCancel}) {
  const [showPatternModal,setShowPatternModal]=useState(false);
  const [showFabricModal,setShowFabricModal]=useState(false);
  const isKimono=form.category==="着物";
  const isObi=form.category==="帯";
  const isObiAcc=form.category==="帯締め"||form.category==="帯揚げ"||form.category==="帯留";
  const showPatternSelect=isKimono||isObi;
  const currentPattern=KIMONO_PATTERNS.find(p=>p.name===form.pattern);
  const currentFabric=isObi
    ? OBI_FABRIC_DATA.find(f=>f.name===form.fabric)
    : FABRIC_DATA.find(f=>f.name===form.fabric);
  return (
    <div>
      <div style={{fontSize:17,fontWeight:"bold",color:C.header,marginBottom:14}}>{editId?"アイテムを編集":"新しいアイテムを登録"}</div>
      <PhotoUpload value={form.photo} onChange={v=>setForm(f=>({...f,photo:v}))}/>
      <div style={{fontSize:12,color:"#b89a7a",textAlign:"center",marginBottom:14,marginTop:5}}>写真をタップして選択・トリミング</div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>名前 *</label>
        <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="例：母から譲り受けた訪問着"
          style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,fontSize:15,color:"#4a3020",boxSizing:"border-box"}}/>
      </div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>カテゴリ</label>
        <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
          style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,background:"#fff",fontSize:15,color:"#4a3020"}}>
          {ITEM_CATEGORIES.map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>種類</label>
        <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
          style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,background:"#fff",fontSize:15,color:"#4a3020"}}>
          {typeOpts.map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>季節・仕立て</label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {SEASONS.map(s=>(
            <button key={s} onClick={()=>setForm(f=>({...f,season:s}))}
              style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${form.season===s?C.accent:"#ddd"}`,background:form.season===s?C.accent:"transparent",color:form.season===s?"#fff":C.header,fontSize:14,cursor:"pointer",fontWeight:form.season===s?"bold":"normal"}}>
              {s}
            </button>
          ))}
        </div>
        <div style={{fontSize:11,color:"#b89a7a",marginTop:5,lineHeight:1.5}}>
          {form.season==="袷"?"● 袷：裏地あり。10〜5月頃（盛夏を除く）に着る最もオーソドックスな仕立て。":
           form.season==="単衣"?"● 単衣：裏地なし。6月・9月の衣替えの時期に着る薄手の仕立て。":
           form.season==="薄物"?"● 薄物：透け感のある生地。7〜8月の盛夏に着る最も薄い仕立て。絽・紗・麻など。":""}
        </div>
      </div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>色</label>
        <input type="text" value={form.color||""} onChange={e=>setForm(f=>({...f,color:e.target.value}))} placeholder="例：藤色"
          style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,fontSize:15,color:"#4a3020",boxSizing:"border-box"}}/>
      </div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>柄</label>
        {showPatternSelect ? (
          <>
            <button onClick={()=>setShowPatternModal(true)}
              style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,background:"#fff",fontSize:15,color:form.pattern?"#4a3020":"#b89a7a",textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>{form.pattern||"柄を選択してください"}</span>
              <span style={{color:"#c8a882"}}>▼</span>
            </button>
            {currentPattern&&(
              <div style={{marginTop:6,padding:"8px 12px",background:"#fff9f0",border:"1px solid #e8d5b0",borderRadius:8,fontSize:12,color:"#5a3a1a",lineHeight:1.6}}>
                💡 {currentPattern.tip}
              </div>
            )}
          </>
        ) : (
          <input type="text" value={form.pattern||""} onChange={e=>setForm(f=>({...f,pattern:e.target.value}))} placeholder="例：花菱"
            style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,fontSize:15,color:"#4a3020",boxSizing:"border-box"}}/>
        )}
      </div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>{isObi?"帯地":"生地"}</label>
        {(isKimono||isObi) ? (
          <>
            <button onClick={()=>setShowFabricModal(true)}
              style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,background:"#fff",fontSize:15,color:form.fabric?"#4a3020":"#b89a7a",textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>{form.fabric||(isObi?"帯地を選択してください":"生地を選択してください")}</span>
              <span style={{color:"#c8a882"}}>▼</span>
            </button>
            {currentFabric&&(
              <div style={{marginTop:6,padding:"8px 12px",background:"#fff9f0",border:"1px solid #e8d5b0",borderRadius:8,fontSize:12,color:"#5a3a1a",lineHeight:1.6}}>
                💡 {currentFabric.tip}
              </div>
            )}
          </>
        ) : (
          <input type="text" value={form.fabric||""} onChange={e=>setForm(f=>({...f,fabric:e.target.value}))} placeholder="例：正絹"
            style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,fontSize:15,color:"#4a3020",boxSizing:"border-box"}}/>
        )}
      </div>
      <div style={{marginBottom:13}}>
        <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>メモ</label>
        <textarea value={form.memo||""} onChange={e=>setForm(f=>({...f,memo:e.target.value}))} placeholder="購入先や思い出など"
          style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,fontSize:15,color:"#4a3020",minHeight:70,resize:"vertical",boxSizing:"border-box"}}/>
      </div>
      <SizeFields category={form.category} sizes={formSizes} setSizes={setFormSizes} unit={formSizeUnit} setUnit={setFormSizeUnit}/>
      <button onClick={submitItem} style={{width:"100%",padding:14,background:C.btn,color:"#fff",border:"none",borderRadius:10,fontSize:16,fontWeight:"bold",cursor:"pointer",marginTop:4}}>
        {editId?"✏️ 更新する":"✨ 登録する"}
      </button>
      {editId&&<button onClick={onCancel} style={{width:"100%",padding:12,background:C.btnLight,color:C.header,border:"none",borderRadius:10,fontSize:15,cursor:"pointer",marginTop:8}}>キャンセル</button>}
      {showPatternModal&&<SelectWithTipModal title="柄" groups={PATTERN_GROUPS} data={KIMONO_PATTERNS} value={form.pattern||""} onChange={v=>setForm(f=>({...f,pattern:v}))} onClose={()=>setShowPatternModal(false)}/>}
      {showFabricModal&&<SelectWithTipModal title={isObi?"帯地":"生地"} groups={isObi?OBI_FABRIC_GROUPS:FABRIC_GROUPS} data={isObi?OBI_FABRIC_DATA:FABRIC_DATA} value={form.fabric||""} onChange={v=>setForm(f=>({...f,fabric:v}))} onClose={()=>setShowFabricModal(false)}/>}
    </div>
  );
}

// ── CoordVisual（帯まわり対応版） ───────────────────────────
function CoordVisual({coord}) {
  const {kimono,obi,komonoList,uwagi,obijime,obiage,obidom}=coord;
  const hasAny = kimono||obi||obijime||obiage||obidom||(komonoList&&komonoList.length>0);
  return (
    <div style={{position:"relative",width:"100%",paddingTop:"150%",borderRadius:12,overflow:"hidden",background:"#1a1008",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"30px 0 48px"}}>
        <div style={{position:"relative",width:"44%",height:"100%",borderRadius:6,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,0.6)",background:"#3a2010"}}>
          {/* 着物 */}
          {kimono?.photo?<img src={kimono.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,opacity:0.25}}>👘</div>}
          {/* 上着 */}
          {uwagi?.photo&&<div style={{position:"absolute",inset:0}}><img src={uwagi.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.65,mixBlendMode:"multiply"}}/></div>}
          {/* 帯エリア: top40%〜height24% */}
          <div style={{position:"absolute",left:0,right:0,top:"40%",height:"24%",overflow:"visible"}}>
            {/* 帯本体 */}
            <div style={{position:"absolute",inset:0,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.7)"}}>
              {obi?.photo?<img src={obi.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"rgba(200,168,130,0.55)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#fff"}}>🎀</div>}
            </div>
            {/* 帯揚げ: 帯の上部に帯幅の20%の高さ */}
            {obiage&&(
              <div style={{position:"absolute",left:0,right:0,top:"-20%",height:"20%",overflow:"hidden",zIndex:3}}>
                {obiage.photo
                  ? <img src={obiage.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.92}}/>
                  : <div style={{width:"100%",height:"100%",background:obiage.color?"":"rgba(255,160,120,0.7)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <div style={{width:"100%",height:"100%",background:obiage.color?`${obiage.color}bb`:"rgba(255,200,160,0.75)"}}/>
                    </div>
                }
              </div>
            )}
            {/* 帯締め: 帯の中央に帯高さの10% */}
            {obijime&&(
              <div style={{position:"absolute",left:0,right:0,top:"45%",height:"10%",zIndex:4,overflow:"hidden"}}>
                {obijime.photo
                  ? <img src={obijime.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <div style={{width:"100%",height:"100%",background:obijime.color?`${obijime.color}dd`:"rgba(180,100,60,0.85)",boxShadow:"0 1px 4px rgba(0,0,0,0.4)"}}/>
                }
                {/* 帯留: 帯締めの中央に小さな正方形(帯締め高さの2倍) */}
                {obidom&&(
                  <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:"18%",paddingTop:"20%",zIndex:5,overflow:"hidden",borderRadius:2,boxShadow:"0 2px 6px rgba(0,0,0,0.5)"}}>
                    <div style={{position:"absolute",inset:0}}>
                      {obidom.photo
                        ? <img src={obidom.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : <div style={{width:"100%",height:"100%",background:obidom.color?`${obidom.color}ee`:"rgba(220,180,80,0.95)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>✦</div>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* 小物サムネイル */}
        {komonoList&&komonoList.length>0&&(
          <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",padding:"0 12px"}}>
            {komonoList.slice(0,6).map((k,i)=>(
              <div key={i} style={{width:40,height:40,borderRadius:8,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(40,20,10,0.7)",flexShrink:0}}>
                {k.photo?<img src={k.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✨</div>}
              </div>
            ))}
          </div>
        )}
        {kimono&&<div style={{position:"absolute",top:8,left:0,right:0,textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.7)",textShadow:"0 1px 3px rgba(0,0,0,0.8)"}}>{kimono.name}{obi?` × ${obi.name}`:""}</div>}
        {!hasAny&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.25)",fontSize:14,textAlign:"center",padding:20}}>着物・帯・小物を<br/>選んでください</div>}
      </div>
    </div>
  );
}

// ── コーデ画面アイテム選択コンポーネント（色・季節フィルター付き） ──
function CoordItemFilter({items, coord, coordStep, setCoord, C}) {
  const [colorFilter, setColorFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("すべて");

  const filtered = items.filter(it => {
    const colorOk = !colorFilter || (it.color && it.color.includes(colorFilter));
    const seasonOk = seasonFilter === "すべて" || it.season === seasonFilter;
    return colorOk && seasonOk;
  });

  const isMulti = coordStep === "komono" || coordStep === "obiacc";
  const getSelected = (item) => {
    if (coordStep === "komono") return coord.komonoList.some(k => k.id === item.id);
    if (coordStep === "obiacc") {
      if (item.category === "帯締め") return coord.obijime?.id === item.id;
      if (item.category === "帯揚げ") return coord.obiage?.id === item.id;
      if (item.category === "帯留") return coord.obidom?.id === item.id;
    }
    return coord[coordStep]?.id === item.id;
  };
  const handleToggle = (item) => {
    if (coordStep === "komono") {
      const sel = coord.komonoList.some(k => k.id === item.id);
      setCoord(cv => ({...cv, komonoList: sel ? cv.komonoList.filter(k=>k.id!==item.id) : [...cv.komonoList, item]}));
    } else if (coordStep === "obiacc") {
      if (item.category === "帯締め") setCoord(cv => ({...cv, obijime: cv.obijime?.id === item.id ? null : item}));
      else if (item.category === "帯揚げ") setCoord(cv => ({...cv, obiage: cv.obiage?.id === item.id ? null : item}));
      else if (item.category === "帯留") setCoord(cv => ({...cv, obidom: cv.obidom?.id === item.id ? null : item}));
    } else {
      const sel = coord[coordStep]?.id === item.id;
      setCoord(cv => ({...cv, [coordStep]: sel ? null : item}));
    }
  };

  const catLabel = {"帯締め":"🪢","帯揚げ":"🌸","帯留":"✦"};

  return (
    <div>
      {/* フィルターUI */}
      <div style={{background:"#fdf8f2",borderRadius:10,padding:"8px 12px",marginBottom:10,border:"1px solid #eddcc8"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:12,color:"#b89a7a",flexShrink:0}}>🎨 色</span>
          <input type="text" value={colorFilter} onChange={e=>setColorFilter(e.target.value)}
            placeholder="例：白、藤色…"
            style={{flex:1,padding:"5px 9px",borderRadius:16,border:"1px solid #c8a882",fontSize:13,color:"#4a3020"}}/>
          {colorFilter && <button onClick={()=>setColorFilter("")} style={{border:"none",background:"transparent",color:"#b89a7a",cursor:"pointer",fontSize:14}}>✕</button>}
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {["すべて","袷","単衣","薄物","その他"].map(s=>(
            <button key={s} onClick={()=>setSeasonFilter(s)}
              style={{padding:"3px 10px",borderRadius:16,border:`1px solid ${seasonFilter===s?"#8b5e3c":"#ddd"}`,background:seasonFilter===s?"#8b5e3c":"transparent",color:seasonFilter===s?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer"}}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {filtered.length===0 && <div style={{color:"#b89a7a",fontSize:14,textAlign:"center",padding:16}}>該当するアイテムがありません</div>}
      {filtered.map(item => {
        const selected = getSelected(item);
        return (
          <div key={item.id} onClick={()=>handleToggle(item)}
            style={{display:"flex",gap:10,padding:10,borderRadius:8,marginBottom:8,background:selected?"#f0dfc8":C.card,border:`2px solid ${selected?C.accent:"#eddcc8"}`,cursor:"pointer"}}>
            <div style={{width:52,height:52,borderRadius:6,overflow:"hidden",background:"#f0e0cc",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {item.photo?<img src={item.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:22}}>{catLabel[item.category]||"👘"}</span>}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{fontSize:11,background:"#f0e0cc",borderRadius:8,padding:"1px 7px",color:"#7a4f2e"}}>{item.category}</span>
                {item.color && <span style={{fontSize:11,color:"#b89a7a"}}>{item.color}</span>}
              </div>
              <div style={{fontWeight:"bold",fontSize:15,color:C.header}}>{item.name}</div>
              <div style={{fontSize:13,color:"#8b6a50"}}>{item.type}・{item.season}</div>
            </div>
            {selected&&<span style={{color:C.accent,fontSize:20,alignSelf:"center"}}>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── 保存済みコーデ詳細モーダル（メモ・タグ機能追加） ────────
function SavedCoordModal({coord,onClose,onLoad,onDelete,onUpdatePhoto,onUpdateMemo}) {
  const ref=useRef(); const [cropSrc,setCropSrc]=useState(null);
  const [editMemo,setEditMemo]=useState(coord.memo||"");
  const [editTags,setEditTags]=useState(coord.tags||[]);
  const [memoEditing,setMemoEditing]=useState(false);
  const items=[coord.kimono,coord.obi,coord.uwagi,...(coord.komonoList||[])].filter(Boolean);

  const toggleTag = (tag) => {
    setEditTags(prev => prev.includes(tag) ? prev.filter(t=>t!==tag) : [...prev,tag]);
  };

  const handleSaveMemo = () => {
    onUpdateMemo(editMemo, editTags);
    setMemoEditing(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto",padding:20}} onClick={e=>e.stopPropagation()}>
        <div style={{fontWeight:"bold",fontSize:17,color:"#7a4f2e",marginBottom:4}}>コーディネート詳細</div>
        <div style={{fontSize:12,color:"#b89a7a",marginBottom:14}}>{coord.date}</div>

        {/* タグ表示 */}
        {coord.tags && coord.tags.length > 0 && (
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {coord.tags.map(t=>(
              <span key={t} style={{padding:"3px 10px",borderRadius:20,background:"#f0dfc8",border:"1px solid #c8a882",fontSize:12,color:"#7a4f2e"}}>#{t}</span>
            ))}
          </div>
        )}

        <CoordVisual coord={coord}/>

        {/* メモ・タグ編集 */}
        <div style={{marginTop:14,background:"#fdf8f2",borderRadius:10,padding:14,border:"1px solid #eddcc8"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:14,fontWeight:"bold",color:"#7a4f2e"}}>📝 メモ・タグ</div>
            <button onClick={()=>setMemoEditing(v=>!v)} style={{border:"1px solid #c8a882",background:"transparent",color:"#7a4f2e",fontSize:12,borderRadius:8,padding:"3px 10px",cursor:"pointer"}}>
              {memoEditing?"キャンセル":"編集"}
            </button>
          </div>
          {memoEditing ? (
            <>
              <textarea value={editMemo} onChange={e=>setEditMemo(e.target.value)} placeholder="このコーデの感想・場所など"
                style={{width:"100%",padding:"9px",borderRadius:8,border:"1px solid #c8a882",fontSize:14,minHeight:70,resize:"vertical",boxSizing:"border-box",marginBottom:10}}/>
              <div style={{fontSize:13,color:"#8b6a50",marginBottom:6}}>タグ（複数選択可）</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                {COORD_TAG_PRESETS.map(t=>(
                  <button key={t} onClick={()=>toggleTag(t)}
                    style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${editTags.includes(t)?"#8b5e3c":"#ddd"}`,background:editTags.includes(t)?"#8b5e3c":"transparent",color:editTags.includes(t)?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer"}}>
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={handleSaveMemo} style={{width:"100%",padding:9,background:"#8b5e3c",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:"bold",fontSize:14}}>保存</button>
            </>
          ) : (
            <div style={{fontSize:14,color:coord.memo?"#4a3020":"#b89a7a",fontStyle:coord.memo?"normal":"italic"}}>
              {coord.memo||"メモなし（タップして追加）"}
            </div>
          )}
        </div>

        {/* 着姿写真 */}
        <div style={{marginTop:14}}>
          <div style={{fontSize:14,fontWeight:"bold",color:"#7a4f2e",marginBottom:6}}>👘 着姿写真</div>
          <div onClick={()=>ref.current.click()} style={{width:"100%",height:200,border:"2px dashed #c8a882",borderRadius:10,overflow:"hidden",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:"#fdf8f3"}}>
            {coord.kisugatPhoto?<img src={coord.kisugatPhoto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(
              <div style={{textAlign:"center",color:"#b89a7a"}}>
                <div style={{fontSize:32,marginBottom:6}}>📷</div>
                <div style={{fontSize:13}}>着姿写真を追加</div>
              </div>
            )}
            <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setCropSrc(ev.target.result);r.readAsDataURL(f);}}/>
          </div>
          {coord.kisugatPhoto&&<button onClick={()=>onUpdatePhoto(null)} style={{marginTop:6,padding:"4px 12px",borderRadius:8,border:"1px solid #e57373",background:"transparent",color:"#e57373",fontSize:12,cursor:"pointer"}}>写真を削除</button>}
        </div>

        {/* アイテム一覧 */}
        <div style={{marginTop:14}}>
          <div style={{fontSize:14,fontWeight:"bold",color:"#7a4f2e",marginBottom:6}}>コーデアイテム</div>
          {items.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,padding:"6px 8px",background:"#fff9f2",borderRadius:8,border:"1px solid #eddcc8"}}>
              <div style={{width:36,height:36,borderRadius:6,overflow:"hidden",background:"#f0e0cc",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {item.photo?<img src={item.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:18}}>👘</span>}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:"bold",color:"#4a3020"}}>{item.name}</div>
                <div style={{fontSize:11,color:"#8b6a50"}}>{item.category}・{item.type}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button onClick={onLoad} style={{flex:1,padding:11,background:"#8b5e3c",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:"bold"}}>このコーデを編集</button>
          <button onClick={onDelete} style={{padding:11,background:"#e57373",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14}}>削除</button>
          <button onClick={onClose} style={{padding:11,background:"#e8d5c0",color:"#7a4f2e",border:"none",borderRadius:8,cursor:"pointer",fontSize:14}}>閉じる</button>
        </div>
      </div>
      {cropSrc&&<Cropper src={cropSrc} onDone={d=>{onUpdatePhoto(d);setCropSrc(null);}} onCancel={()=>setCropSrc(null)}/>}
    </div>
  );
}

// ── 検索・フィルターパネル ────────────────────────────────────
function SearchPanel({ search, setSearch, filter, setFilter, seasonFilter, setSeasonFilter, sortBy, setSortBy }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{marginBottom:14}}>
      {/* 検索バー */}
      <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
        <div style={{flex:1,position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:16,color:"#b89a7a"}}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="名前・色・柄・メモで検索…"
            style={{width:"100%",padding:"9px 9px 9px 34px",borderRadius:24,border:"1.5px solid #c8a882",fontSize:14,boxSizing:"border-box",background:"#fff",color:"#4a3020"}}
          />
          {search && (
            <button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",fontSize:16,cursor:"pointer",color:"#b89a7a"}}>✕</button>
          )}
        </div>
        <button onClick={()=>setOpen(v=>!v)} style={{padding:"8px 14px",borderRadius:20,border:`1.5px solid ${open?"#8b5e3c":"#c8a882"}`,background:open?"#8b5e3c":"transparent",color:open?"#fff":"#7a4f2e",fontSize:13,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
          ⚙️ 絞込
        </button>
      </div>

      {/* カテゴリタブ */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom: open?8:0}}>
        {["すべて",...ITEM_CATEGORIES].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filter===f?"#8b5e3c":"#c8a882"}`,background:filter===f?"#8b5e3c":"transparent",color:filter===f?"#fff":"#7a4f2e",fontSize:13,cursor:"pointer"}}>{f}</button>
        ))}
      </div>

      {/* 詳細フィルター */}
      {open && (
        <div style={{background:"#fff9f2",borderRadius:10,padding:12,marginTop:8,border:"1px solid #eddcc8"}}>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:13,color:"#8b6a50",marginBottom:6}}>季節・仕立て</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["すべて",...SEASONS].map(s=>(
                <button key={s} onClick={()=>setSeasonFilter(s)}
                  style={{padding:"4px 10px",borderRadius:16,border:`1px solid ${seasonFilter===s?"#8b5e3c":"#ddd"}`,background:seasonFilter===s?"#8b5e3c":"transparent",color:seasonFilter===s?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer"}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:13,color:"#8b6a50",marginBottom:6}}>並び順</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[["登録順","default"],["着用回数","wearCount"],["名前順","name"]].map(([label,val])=>(
                <button key={val} onClick={()=>setSortBy(val)}
                  style={{padding:"4px 10px",borderRadius:16,border:`1px solid ${sortBy===val?"#8b5e3c":"#ddd"}`,background:sortBy===val?"#8b5e3c":"transparent",color:sortBy===val?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer"}}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── コーデタグフィルター ─────────────────────────────────────
function CoordTagFilter({ activeTag, setActiveTag }) {
  return (
    <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
      <button onClick={()=>setActiveTag(null)}
        style={{padding:"4px 12px",borderRadius:20,border:`1px solid ${activeTag===null?"#8b5e3c":"#c8a882"}`,background:activeTag===null?"#8b5e3c":"transparent",color:activeTag===null?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
        すべて
      </button>
      {COORD_TAG_PRESETS.map(t=>(
        <button key={t} onClick={()=>setActiveTag(activeTag===t?null:t)}
          style={{padding:"4px 12px",borderRadius:20,border:`1px solid ${activeTag===t?"#8b5e3c":"#c8a882"}`,background:activeTag===t?"#8b5e3c":"transparent",color:activeTag===t?"#fff":"#7a4f2e",fontSize:12,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
          #{t}
        </button>
      ))}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────
const defaultForm={name:"",category:"着物",type:"",season:"通年",color:"",pattern:"",material:"",memo:"",photo:null};
const defaultProfile={nickname:"",email:"",password:""};
const defaultCoord={kimono:null,obi:null,komonoList:[],uwagi:null,obijime:null,obiage:null,obidom:null};

export default function App() {
  const [items,setItems]=useState([]);
  const [tab,setTab]=useState("db");
  const [form,setForm]=useState(defaultForm);
  const [formSizes,setFormSizes]=useState({});
  const [formSizeUnit,setFormSizeUnit]=useState("cm");
  const [editId,setEditId]=useState(null);
  const [filter,setFilter]=useState("すべて");
  const [search,setSearch]=useState("");
  const [seasonFilter,setSeasonFilter]=useState("すべて");
  const [sortBy,setSortBy]=useState("default");
  const [coord,setCoord]=useState(defaultCoord);
  const [coordStep,setCoordStep]=useState("kimono");
  const [savedCoords,setSavedCoords]=useState([]);
  const [coordTagFilter,setCoordTagFilter]=useState(null);
  const [detail,setDetail]=useState(null);
  const [selectedSavedCoord,setSelectedSavedCoord]=useState(null);
  const [loading,setLoading]=useState(true);
  const [profile,setProfile]=useState(defaultProfile);
  const [profileSizes,setProfileSizes]=useState({});
  const [profileSizeUnit,setProfileSizeUnit]=useState("cm");
  const [showPw,setShowPw]=useState(false);
  const [wearHistory,setWearHistory]=useState([]);
  const [wearHistoryModal,setWearHistoryModal]=useState(null); // item
  const [setsuki] = useState(()=>getRandomSetsuki());

  useEffect(()=>{
    (async()=>{
      const its=await loadAllItems(); setItems(its);
      const cs=await loadCoords(); setSavedCoords(cs);
      const wh=await loadWearHistory(); setWearHistory(wh);
      try{const raw=lsGet("kimono_profile");if(raw){const p=JSON.parse(raw);setProfile(p);setProfileSizes(p.sizes||{});setProfileSizeUnit(p.sizeUnit||"cm");}}catch{}
      setLoading(false);
    })();
  },[]);

  const persistItems=async ni=>{setItems(ni);await saveAllItems(ni);};

  const submitItem=async ()=>{
    if(!form.name) return;
    const item={...form,sizes:formSizes,sizeUnit:formSizeUnit};
    let ni;
    if(editId!==null){ni=items.map(it=>it.id===editId?{...item,id:editId}:it);}
    else{ni=[...items,{...item,id:Date.now()}];}
    await persistItems(ni);
    setEditId(null); setForm(defaultForm); setFormSizes({}); setFormSizeUnit("cm"); setTab("db");
  };

  const deleteItem=async id=>{
    const ni=items.filter(it=>it.id!==id);
    await persistItems(ni);
    lsRemove("kiri_photo_"+id);
  };

  const startEdit=item=>{setForm(item);setFormSizes(item.sizes||{});setFormSizeUnit(item.sizeUnit||"cm");setEditId(item.id);setDetail(null);setTab("add");};

  const handleSaveCoord=async ()=>{
    if(!coord.kimono) return;
    const newCoords=[...savedCoords,{id:Date.now(),...coord,date:new Date().toLocaleDateString("ja-JP"),kisugatPhoto:null,memo:"",tags:[],obijime:coord.obijime||null,obiage:coord.obiage||null,obidom:coord.obidom||null}];
    setSavedCoords(newCoords); await saveCoords(newCoords);
    alert("コーディネートを保存しました！");
  };

  const updateSavedCoordPhoto=async (id,photo)=>{
    const nc=savedCoords.map(sc=>sc.id===id?{...sc,kisugatPhoto:photo}:sc);
    setSavedCoords(nc); await saveCoords(nc);
    setSelectedSavedCoord(prev=>prev?{...prev,kisugatPhoto:photo}:prev);
  };

  const updateSavedCoordMemo=async (id,memo,tags)=>{
    const nc=savedCoords.map(sc=>sc.id===id?{...sc,memo,tags}:sc);
    setSavedCoords(nc); await saveCoords(nc);
    setSelectedSavedCoord(prev=>prev?{...prev,memo,tags}:prev);
  };

  const handleDeleteSavedCoord=async id=>{
    if(!confirm("このコーデを削除しますか？")) return;
    const nc=await deleteCoordById(id,savedCoords);
    setSavedCoords(nc); setSelectedSavedCoord(null);
  };

  const loadSavedCoord=sc=>{
    setCoord({kimono:sc.kimono,obi:sc.obi,komonoList:sc.komonoList||[],uwagi:sc.uwagi||null,obijime:sc.obijime||null,obiage:sc.obiage||null,obidom:sc.obidom||null});
    setSelectedSavedCoord(null); setTab("coord");
  };

  // 着用履歴
  const addWearRecord = async (record) => {
    const nh = [...wearHistory, record];
    setWearHistory(nh);
    await saveWearHistory(nh);
  };
  const deleteWearRecord = async (recordId) => {
    const nh = wearHistory.filter(h => h.id !== recordId);
    setWearHistory(nh);
    await saveWearHistory(nh);
  };
  const getWearCount = (itemId) => wearHistory.filter(h => h.itemId === itemId).length;

  // 検索・フィルター・ソート
  const filtered = items
    .filter(it => filter==="すべて" || it.category===filter)
    .filter(it => seasonFilter==="すべて" || it.season===seasonFilter)
    .filter(it => {
      if(!search) return true;
      const q=search.toLowerCase();
      return [it.name,it.color,it.pattern,it.fabric,it.type,it.memo].some(v=>v&&v.toLowerCase().includes(q));
    })
    .sort((a,b)=>{
      if(sortBy==="name") return a.name.localeCompare(b.name,"ja");
      if(sortBy==="wearCount") return getWearCount(b.id)-getWearCount(a.id);
      return 0;
    });

  // コーデタグフィルター
  const filteredCoords = coordTagFilter
    ? savedCoords.filter(sc => sc.tags && sc.tags.includes(coordTagFilter))
    : savedCoords;

  const typeOpts=form.category==="着物"?KIMONO_TYPES:form.category==="帯"?OBI_TYPES:form.category==="帯締め"?OBIJIME_TYPES:form.category==="帯揚げ"?OBIAGE_TYPES:form.category==="帯留"?OBIDOM_TYPES:form.category==="上着"?UWAGI_TYPES:KOMON_TYPES;
  const catItems=cat=>items.filter(it=>it.category===cat);
  const coordSteps=[["kimono","👘 着物"],["obi","🎀 帯"],["obiacc","🪢 帯まわり"],["uwagi","🧥 上着"],["komono","✨ 小物"]];
  const getStepList=step=>{
    if(step==="obiacc") return [...catItems("帯締め"),...catItems("帯揚げ"),...catItems("帯留")];
    return {kimono:catItems("着物"),obi:catItems("帯"),uwagi:catItems("上着"),komono:catItems("小物")}[step]||[];
  };
  const stepLabel=step=>({kimono:"着物",obi:"帯",obiacc:"帯まわり",uwagi:"上着",komono:"小物"}[step]||step);

  const tc=todayColor;
  const C={bg:"#fdf6ee",header:"#7a4f2e",accent:"#c8a882",card:"#fff9f2",btn:"#8b5e3c",btnLight:"#e8d5c0"};

  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,fontSize:16}}>読み込み中...</div>;

  return (
    <div style={{fontFamily:"'Hiragino Sans','Yu Gothic',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",fontSize:15}}>
      {/* 季節ヘッダー */}
      <div style={{background:`linear-gradient(135deg,${tc.bg},${tc.bg}cc)`,color:tc.text,padding:"12px 16px"}}>
        <div style={{fontSize:13,fontWeight:"bold",marginBottom:3}}>🌸 {setsuki.name}の頃</div>
        <div style={{fontSize:12,lineHeight:1.8,opacity:0.95}}>
          🌿 茶花：{setsuki.flower}<br/>
          📝 {setsuki.greeting}<br/>
          👘 この季節の柄：{setsuki.pattern}
        </div>
      </div>

      {/* タイトル */}
      <div style={{background:tc.bg,color:tc.text,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <TansuSVG size={36}/>
          <span style={{fontSize:19,fontWeight:"bold",letterSpacing:4}}>桐箪笥</span>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,opacity:0.7}}>今日の色</div>
          <div style={{fontSize:13,fontWeight:"bold",letterSpacing:1}}>{tc.name}</div>
        </div>
      </div>

      {/* タブ */}
      <div style={{display:"flex",background:"#f0e0cc",borderBottom:`2px solid ${C.accent}`}}>
        {[["db","📚 一覧"],["coord","✨ コーデ"],["add",editId?"✏️ 編集":"➕ 登録"],["profile","👤 私"]].map(([key,label])=>(
          <button key={key} onClick={()=>{setTab(key);if(key!=="add"&&editId){setEditId(null);setForm(defaultForm);setFormSizes({});setFormSizeUnit("cm");}}}
            style={{flex:1,padding:"11px 2px",border:"none",background:tab===key?C.accent:"transparent",color:tab===key?"#fff":C.header,fontWeight:tab===key?"bold":"normal",cursor:"pointer",fontSize:13}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{padding:16}}>
        {/* ── 一覧 ── */}
        {tab==="db"&&(
          <div>
            <SearchPanel
              search={search} setSearch={setSearch}
              filter={filter} setFilter={setFilter}
              seasonFilter={seasonFilter} setSeasonFilter={setSeasonFilter}
              sortBy={sortBy} setSortBy={setSortBy}
            />
            {search && (
              <div style={{fontSize:13,color:"#b89a7a",marginBottom:8}}>
                「{search}」の検索結果：{filtered.length}件
              </div>
            )}
            {filtered.length===0&&<div style={{textAlign:"center",color:"#b89a7a",padding:40,fontSize:15}}>
              {search||filter!=="すべて"||seasonFilter!=="すべて" ? "該当するアイテムがありません" : "アイテムがまだありません。\n「登録」から追加してください。"}
            </div>}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtered.map(item=>{
                const wc=getWearCount(item.id);
                return (
                  <div key={item.id} onClick={()=>setDetail(item)} style={{background:C.card,borderRadius:10,padding:12,display:"flex",gap:12,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",cursor:"pointer",border:"1px solid #eddcc8"}}>
                    <div style={{width:68,height:68,borderRadius:8,overflow:"hidden",flexShrink:0,background:"#f0e0cc",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {item.photo?<img src={item.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:28}}>👘</span>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{fontWeight:"bold",fontSize:16,color:C.header,marginBottom:3,flex:1}}>{item.name}</div>
                        {wc>0&&<span style={{fontSize:12,background:"#f0dfc8",color:"#7a4f2e",borderRadius:12,padding:"2px 8px",flexShrink:0,marginLeft:6}}>👘{wc}回</span>}
                      </div>
                      <div style={{fontSize:13,color:"#8b6a50"}}>{item.category}{item.type&&`・${item.type}`}</div>
                      <div style={{fontSize:13,color:"#8b6a50"}}>{item.season}{item.color&&`・${item.color}`}</div>
                      {item.memo&&<div style={{fontSize:12,color:"#aaa",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.memo}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 詳細 ── */}
        {detail&&(
          <DetailModal
            detail={detail}
            onClose={()=>setDetail(null)}
            onEdit={()=>startEdit(detail)}
            onDelete={()=>{
              deleteItem(detail.id);
              setDetail(null);
            }}
            onWearHistory={()=>{setWearHistoryModal(detail);setDetail(null);}}
            wearCount={getWearCount(detail.id)}
            C={C}
          />
        )}

        {/* ── 着用履歴モーダル ── */}
        {wearHistoryModal&&(
          <WearHistoryModal
            item={wearHistoryModal}
            history={wearHistory}
            onClose={()=>setWearHistoryModal(null)}
            onAdd={addWearRecord}
            onDelete={deleteWearRecord}
          />
        )}

        {/* ── コーデ ── */}
        {tab==="coord"&&(
          <div>
            <div style={{marginBottom:16}}><CoordVisual coord={coord}/></div>
            <div style={{display:"flex",gap:4,marginBottom:14}}>
              {coordSteps.map(([key,label])=>(
                <button key={key} onClick={()=>setCoordStep(key)} style={{flex:1,padding:"8px 2px",borderRadius:8,border:`2px solid ${coordStep===key?C.accent:"#ddd"}`,background:coordStep===key?C.accent:"transparent",color:coordStep===key?"#fff":C.header,fontSize:12,cursor:"pointer",fontWeight:coordStep===key?"bold":"normal"}}>
                  {label}
                </button>
              ))}
            </div>
            {getStepList(coordStep).length===0&&<div style={{color:"#b89a7a",fontSize:14,textAlign:"center",padding:20}}>{coordStep==="obiacc"?"帯締め・帯揚げ・帯留が登録されていません":stepLabel(coordStep)+"が登録されていません"}</div>}
            {/* コーデフィルター（色・季節） */}
            <CoordItemFilter
              items={getStepList(coordStep)}
              coord={coord}
              coordStep={coordStep}
              setCoord={setCoord}
              C={C}
            />
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={handleSaveCoord} style={{flex:1,padding:13,background:C.btn,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:"bold"}}>💾 コーデを保存</button>
              <button onClick={()=>setCoord(defaultCoord)} style={{padding:13,background:C.btnLight,color:C.header,border:"none",borderRadius:10,cursor:"pointer",fontSize:14}}>リセット</button>
            </div>

            {/* 保存済みコーデ */}
            {savedCoords.length>0&&(
              <div style={{marginTop:22}}>
                <div style={{fontSize:16,fontWeight:"bold",color:C.header,marginBottom:8}}>保存済みコーデ</div>
                <CoordTagFilter activeTag={coordTagFilter} setActiveTag={setCoordTagFilter}/>
                {filteredCoords.length===0&&<div style={{color:"#b89a7a",fontSize:14,textAlign:"center",padding:16}}>このタグのコーデはありません</div>}
                {filteredCoords.slice().reverse().map(sc=>(
                  <div key={sc.id} onClick={()=>setSelectedSavedCoord(sc)} style={{background:C.card,borderRadius:10,padding:12,marginBottom:8,border:"1px solid #eddcc8",cursor:"pointer"}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      {sc.kisugatPhoto?(
                        <img src={sc.kisugatPhoto} alt="" style={{width:64,height:72,objectFit:"cover",borderRadius:8,flexShrink:0}}/>
                      ):(
                        <div style={{display:"flex",gap:4,flexWrap:"wrap",maxWidth:100,flexShrink:0}}>
                          {[sc.kimono,sc.obi,sc.uwagi,...(sc.komonoList||[])].filter(Boolean).slice(0,4).map((item,i)=>(
                            <div key={i} style={{width:44,height:44,borderRadius:6,overflow:"hidden",background:"#f0e0cc",display:"flex",alignItems:"center",justifyContent:"center"}}>
                              {item.photo?<img src={item.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:18}}>👘</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,color:"#b89a7a",marginBottom:3}}>{sc.date}</div>
                        {sc.tags && sc.tags.length>0 && (
                          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                            {sc.tags.map(t=><span key={t} style={{fontSize:11,background:"#f0dfc8",borderRadius:10,padding:"1px 7px",color:"#7a4f2e"}}>#{t}</span>)}
                          </div>
                        )}
                        {sc.memo && <div style={{fontSize:12,color:"#8b6a50",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sc.memo}</div>}
                        <div style={{fontSize:12,color:"#8b6a50",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                          {[sc.kimono?.name,sc.obi?.name,sc.uwagi?.name,...(sc.komonoList||[]).map(k=>k.name)].filter(Boolean).join(" ／ ")}
                        </div>
                        {sc.kisugatPhoto&&<div style={{fontSize:11,color:C.accent,marginTop:3}}>👘 着姿写真あり</div>}
                      </div>
                      <span style={{color:"#ccc",fontSize:20}}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 登録 ── */}
        {tab==="add"&&(
          <AddForm
            form={form} setForm={setForm}
            formSizes={formSizes} setFormSizes={setFormSizes}
            formSizeUnit={formSizeUnit} setFormSizeUnit={setFormSizeUnit}
            editId={editId} setEditId={setEditId}
            submitItem={submitItem}
            typeOpts={typeOpts} C={C}
            onCancel={()=>{setEditId(null);setForm(defaultForm);setFormSizes({});setFormSizeUnit("cm");setTab("db");}}
          />
        )}

        {/* ── プロフィール ── */}
        {tab==="profile"&&(
          <div>
            <div style={{fontSize:17,fontWeight:"bold",color:C.header,marginBottom:16}}>👤 個人プロフィール</div>

            {/* 着用統計 */}
            {items.length > 0 && (
              <div style={{background:"linear-gradient(135deg,#f0dfc8,#e8c9a0)",borderRadius:12,padding:16,marginBottom:16}}>
                <div style={{fontSize:14,fontWeight:"bold",color:"#7a4f2e",marginBottom:10}}>📊 着用統計</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{background:"rgba(255,255,255,0.6)",borderRadius:8,padding:10,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:"bold",color:"#7a4f2e"}}>{items.length}</div>
                    <div style={{fontSize:12,color:"#b89a7a"}}>登録アイテム</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.6)",borderRadius:8,padding:10,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:"bold",color:"#7a4f2e"}}>{wearHistory.length}</div>
                    <div style={{fontSize:12,color:"#b89a7a"}}>着用記録</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.6)",borderRadius:8,padding:10,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:"bold",color:"#7a4f2e"}}>{savedCoords.length}</div>
                    <div style={{fontSize:12,color:"#b89a7a"}}>コーデ保存数</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.6)",borderRadius:8,padding:10,textAlign:"center"}}>
                    <div style={{fontSize:24,fontWeight:"bold",color:"#7a4f2e"}}>
                      {items.reduce((max,it)=>Math.max(max,getWearCount(it.id)),0)}
                    </div>
                    <div style={{fontSize:12,color:"#b89a7a"}}>最多着用回数</div>
                  </div>
                </div>
                {/* よく着るアイテム */}
                {wearHistory.length > 0 && (() => {
                  const top = items.sort((a,b)=>getWearCount(b.id)-getWearCount(a.id)).filter(it=>getWearCount(it.id)>0)[0];
                  return top ? (
                    <div style={{marginTop:10,padding:"8px 12px",background:"rgba(255,255,255,0.5)",borderRadius:8,fontSize:13,color:"#7a4f2e"}}>
                      🌟 よく着るアイテム：<strong>{top.name}</strong>（{getWearCount(top.id)}回）
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {[{label:"愛称",key:"nickname",type:"text",placeholder:"例：きものこ"},{label:"メールアドレス",key:"email",type:"email",placeholder:"example@mail.com"}].map(({label,key,type,placeholder})=>(
              <div key={key} style={{marginBottom:14}}>
                <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>{label}</label>
                <input type={type} value={profile[key]||""} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))} placeholder={placeholder}
                  style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,fontSize:15,color:"#4a3020",boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <label style={{fontSize:14,color:"#8b6a50",display:"block",marginBottom:4}}>パスワード（メモ用）</label>
              <div style={{display:"flex",gap:8}}>
                <input type={showPw?"text":"password"} value={profile.password||""} onChange={e=>setProfile(p=>({...p,password:e.target.value}))} placeholder="パスワードを入力"
                  style={{flex:1,padding:"10px",borderRadius:8,border:`1px solid ${C.accent}`,fontSize:15,color:"#4a3020",boxSizing:"border-box"}}/>
                <button onClick={()=>setShowPw(v=>!v)} style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${C.accent}`,background:"transparent",cursor:"pointer",fontSize:13,color:C.header}}>{showPw?"隠す":"表示"}</button>
              </div>
            </div>
            <div style={{background:"#f5ece0",borderRadius:10,padding:14,marginBottom:16}}>
              <div style={{fontSize:15,fontWeight:"bold",color:C.header,marginBottom:10}}>👘 自分の着物サイズ</div>
              <SizeFields category="着物" sizes={profileSizes} setSizes={setProfileSizes} unit={profileSizeUnit} setUnit={setProfileSizeUnit}/>
            </div>
            <button onClick={()=>{const p={...profile,sizes:profileSizes,sizeUnit:profileSizeUnit};setProfile(p);lsSet("kimono_profile",JSON.stringify(p));alert("保存しました！");}} style={{width:"100%",padding:14,background:C.btn,color:"#fff",border:"none",borderRadius:10,fontSize:16,fontWeight:"bold",cursor:"pointer"}}>
              💾 保存する
            </button>
            {profile.nickname&&(
              <div style={{marginTop:20,padding:14,background:C.card,borderRadius:10,border:"1px solid #eddcc8"}}>
                <div style={{fontSize:14,color:"#b89a7a",marginBottom:6}}>登録済みプロフィール</div>
                <div style={{fontSize:17,fontWeight:"bold",color:C.header,marginBottom:4}}>{profile.nickname} さん</div>
                {profile.email&&<div style={{fontSize:14,color:"#8b6a50",marginBottom:6}}>{profile.email}</div>}
                <SizeDisplay category="着物" sizes={profileSizes} savedUnit={profileSizeUnit}/>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSavedCoord&&(
        <SavedCoordModal
          coord={selectedSavedCoord}
          onClose={()=>setSelectedSavedCoord(null)}
          onLoad={()=>loadSavedCoord(selectedSavedCoord)}
          onDelete={()=>handleDeleteSavedCoord(selectedSavedCoord.id)}
          onUpdatePhoto={photo=>updateSavedCoordPhoto(selectedSavedCoord.id,photo)}
          onUpdateMemo={(memo,tags)=>updateSavedCoordMemo(selectedSavedCoord.id,memo,tags)}
        />
      )}
    </div>
  );
}
