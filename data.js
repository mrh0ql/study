// ============================================================
// Quiz data — Stage 16 / 17 Review (Cambridge Latin)
// ============================================================

// ---------- Declension chart ----------
// Order of rows: Nom, Gen, Dat, Acc, Abl
// Columns: 1st Sg, 1st Pl, 2nd Sg, 2nd Pl, 3rd Sg, 3rd Pl
// (Each cell accepts the ending with or without a leading hyphen.)
const DECLENSIONS = {
  rows: ["Nom", "Gen", "Dat", "Acc", "Abl"],
  columns: [
    { decl: "1st",   num: "Sg" },
    { decl: "1st",   num: "Pl" },
    { decl: "2nd",   num: "Sg" },
    { decl: "2nd",   num: "Pl" },
    { decl: "3rd",   num: "Sg" },
    { decl: "3rd",   num: "Pl" },
  ],
  // Accepted answers for each row/column (array of valid variants)
  answers: {
    Nom: [["a"], ["ae"], ["us", "um"], ["i", "a"], ["-", "x", "varies", ""], ["es"]],
    Gen: [["ae"], ["arum"], ["i"], ["orum"], ["is"], ["um"]],
    Dat: [["ae"], ["is"], ["o"], ["is"], ["i"], ["ibus"]],
    Acc: [["am"], ["as"], ["um"], ["os", "a"], ["em"], ["es"]],
    Abl: [["a"], ["is"], ["o"], ["is"], ["e"], ["ibus"]],
  },
};

// ---------- Case uses ----------
const CASE_USES = [
  { case: "Nominative", uses: ["subject", "complement"] },
  { case: "Genitive",   uses: ["possession"] },
  { case: "Dative",     uses: ["io", "osv"] },                // indirect object, OSV
  { case: "Accusative", uses: ["do", "op"] },                 // direct object, object of preposition
  { case: "Ablative",   uses: ["op"] },                       // object of preposition
];

// ---------- Tense chart (Stage 16/17) ----------
// Formation = Principal Part minus "?"
// Tense Marker
// Endings (ordered 1s, 2s, 3s, 1p, 2p, 3p)
// Translation of amare for 1st-person (multiple acceptable)
const TENSES = [
  {
    name: "Praesens",
    formationPart: "2",          // 2nd principal part
    formationMinus: "re",
    tenseMarker: ["none", "x", "-", ""],
    endings: ["o/m", "s", "t", "mus", "tis", "nt"],
    endingAlternates: [["o", "m", "o/m", "m/o"], ["s"], ["t"], ["mus"], ["tis"], ["nt"]],
    translations: ["i love", "i am loving", "i do love"],
  },
  {
    name: "Imperfectum",
    formationPart: "2",
    formationMinus: "re",
    tenseMarker: ["ba"],
    endings: ["m", "s", "t", "mus", "tis", "nt"],
    endingAlternates: [["m"], ["s"], ["t"], ["mus"], ["tis"], ["nt"]],
    translations: ["i was loving", "i loved", "i used to love"],
  },
  {
    name: "Perfectum",
    formationPart: "3",          // 3rd principal part
    formationMinus: "i",
    tenseMarker: ["none", "x", "-", ""],
    endings: ["i", "isti", "it", "imus", "istis", "erunt"],
    endingAlternates: [["i"], ["isti"], ["it"], ["imus"], ["istis"], ["erunt"]],
    translations: ["i loved", "i have loved", "i did love"],
  },
  {
    name: "Pluperfectum",
    formationPart: "3",
    formationMinus: "i",
    tenseMarker: ["era"],
    endings: ["m", "s", "t", "mus", "tis", "nt"],
    endingAlternates: [["m", "eram"], ["s", "eras"], ["t", "erat"], ["mus", "eramus"], ["tis", "eratis"], ["nt", "erant"]],
    translations: ["i had loved"],
  },
];

// ---------- Vocabulary / People / Res of Stage 16 ----------
const VOCAB = {
  fabula: "story / play",
  res: "things / matter / business",
  people: [
    { name: "Quintus",    aliases: ["quintus"],                  desc: "a young Roman, friend of Salvius, visiting Britain" },
    { name: "Cogidubnus", aliases: ["cogi", "cogidubnus"],       desc: "king of the Regnenses (British client king of Rome)" },
    { name: "Dumnorix",   aliases: ["dumnorix"],                 desc: "chief of the Regnenses, friend of Cogidubnus" },
    { name: "Belimicus",  aliases: ["belimicus"],                desc: "chief of the Cantiaci, rival of Dumnorix" },
    { name: "Salvius",    aliases: ["salvius"],                  desc: "Roman official sent to Britain; ambitious and scheming" },
  ],
  caseUsesRef: [
    "Nom: subject, complement",
    "Gen: possession",
    "Dat: IO (indirect object), OSV",
    "Acc: DO (direct object), OP (object of preposition)",
    "Abl: OP (object of preposition)",
  ],
  cultura: "cultural / cultural background section of the stage",
};

// ---------- Stage 16 Review Checklist (24 words) ----------
// Each `answers` array holds all acceptable English meanings for the Latin word.
// The quiz accepts ANY one of them; macrons are optional on input.
const VOCAB_WORDS = [
  { latin: "aedificō",   answers: ["build"] },
  { latin: "auxilium",   answers: ["help"] },
  { latin: "bonus",      answers: ["good"] },
  { latin: "cōnsentiō",  answers: ["agree"] },
  { latin: "cōnsilium",  answers: ["plan", "idea"] },
  { latin: "deinde",     answers: ["then"] },
  { latin: "dēlectō",    answers: ["delight", "please"] },
  { latin: "effugiō",    answers: ["escape"] },
  { latin: "flōs",       answers: ["flower"] },
  { latin: "imperātor",  answers: ["emperor"] },
  { latin: "inter",      answers: ["among", "between"] },
  { latin: "ita",        answers: ["in this way"] },
  { latin: "melior",     answers: ["better"] },
  { latin: "nāvigō",     answers: ["sail"] },
  { latin: "nōnne",      answers: ["surely", "surely?"] },
  { latin: "pereō",      answers: ["die", "perish"] },
  { latin: "pōnō",       answers: ["place", "put", "put up"] },
  { latin: "postrīdiē",  answers: ["on the next day", "the next day", "next day"] },
  { latin: "pūniō",      answers: ["punish"] },
  { latin: "simulac",    answers: ["as soon as"] },
  { latin: "simulatque", answers: ["as soon as"] },
  { latin: "summus",     answers: ["highest", "greatest", "top"] },
  { latin: "tollō",      answers: ["raise", "lift up", "hold up"] },
  { latin: "vertō",      answers: ["turn"] },
];

// ---------- Stage 17 Question Words (8) ----------
// Match Latin question words to their English meanings.
// `answers` = all accepted English answers (matched case-insensitive, punctuation ignored).
const QUESTION_WORDS = [
  { latin: "cur",     answers: ["why", "why?"] },
  { latin: "nōnne",   answers: ["surely", "surely?", "surely yes", "yes", "expects yes"] },
  { latin: "quid",    answers: ["what", "what?"] },
  { latin: "-ne",     answers: ["yes/no", "yes or no", "yes/no?", "question", "question marker", "asks a yes/no question"] },
  { latin: "num",     answers: ["surely not", "surely not?", "surely...not", "surelynot", "no", "expects no"] },
  { latin: "ubi",     answers: ["where", "where?"] },
  { latin: "quis",    answers: ["who", "who?"] },
  { latin: "quōmodo", answers: ["how", "how?"] },
];

// ---------- Apostles' Creed ----------
// Latin and English. The "focus" excerpt from the task is typed in full within the full text.
const CREED_LATIN = `Credo in Deum, Patrem omnipotentem, Creatorem caeli et terrae.
Et in Iesum Christum, Filium eius unicum, Dominum nostrum,
qui conceptus est de Spiritu Sancto, natus ex Maria Virgine,
passus sub Pontio Pilato, crucifixus, mortuus, et sepultus,
descendit ad inferos, tertia die resurrexit a mortuis,
ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis,
inde venturus est iudicare vivos et mortuos.
Credo in Spiritum Sanctum,
sanctam Ecclesiam catholicam, sanctorum communionem,
remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.`;

const CREED_ENGLISH = `I believe in God, the Father almighty, Creator of heaven and earth.
And in Jesus Christ, his only Son, our Lord,
who was conceived by the Holy Spirit, born of the Virgin Mary,
suffered under Pontius Pilate, was crucified, died, and was buried;
he descended into hell; on the third day he rose again from the dead;
he ascended into heaven, and is seated at the right hand of God the Father almighty;
from there he will come to judge the living and the dead.
I believe in the Holy Spirit,
the holy catholic Church, the communion of saints,
the forgiveness of sins, the resurrection of the body,
and life everlasting. Amen.`;

// Focus excerpt (the portion explicitly named in the study sheet)
const CREED_FOCUS_LATIN = `sedet ad dexteram Dei
Patris omnipotentis,
inde venturus est iudicare vivos et mortuos.
Credo in Spiritum Sanctum`;

// ---------- Helpers ----------
function stripMacrons(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0304]/g, "")   // combining macron
    .normalize("NFC")
    .replace(/[āĀ]/g, "a")
    .replace(/[ēĒ]/g, "e")
    .replace(/[īĪ]/g, "i")
    .replace(/[ōŌ]/g, "o")
    .replace(/[ūŪ]/g, "u");
}

function norm(s) {
  return stripMacrons(String(s || ""))
    .toLowerCase()
    .replace(/[.,;:!?()"“”‘’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Strict normalization for Latin typing — keeps words but ignores punctuation/case/whitespace runs
function normText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[.,;:!?()"“”‘’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Normalize an ending: strip leading dash / whitespace, lower case
function normEnding(s) {
  return String(s || "").toLowerCase().replace(/^[-\s]+/, "").replace(/\s+/g, "").trim();
}

// Accept any of a list of valid variants
function matchesAny(input, validArr) {
  const v = normEnding(input);
  return validArr.some(x => normEnding(x) === v);
}
