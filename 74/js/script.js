let besu = 1080000;//1体のキャラの必要コイン
let besucoin = 1050000;
let levikoin = 30000;//１レベル上がるための必要コイン

//キャラ別必要ツム数
let hituyou = {
  28: { 1: 2, 2: 3, 3: 4, 4: 6, 5: 12, 6: 0 },
  30: { 1: 2, 2: 3, 3: 4, 4: 6, 5: 14, 6: 0 },
  32: { 1: 2, 2: 3, 3: 4, 4: 6, 5: 16, 6: 0 },
  34: { 1: 2, 2: 3, 3: 4, 4: 6, 5: 18, 6: 0 },
  36: { 1: 2, 2: 3, 3: 4, 4: 6, 5: 20, 6: 0 }
};

let ritu = {
  28: {
    1:[0],
    2:[0,50],
    3:[0,33,66],
    4:[0,25,50,75],
    5:[0,8,16,24,32,40,48,56,64,72,80,88],
    6:[0]
  },
  30: {
    1:[0],
    2:[0,50],
    3:[0,33,66],
    4:[0,25,50,75],
    5:[0,7,14,21,28,35,42,49,56,63,70,77,84,91],
    6:[0]
  },
  32: {
    1:[0],
    2:[0,50],
    3:[0,33,66],
    4:[0,25,50,75],
    5:[0,6,12,18,24,30,36,42,48,54,60,66,72,78,84,90],
    6:[0]
  },
  34: {
  1:[0],
  2:[0,50],
  3:[0,33,66],
  4:[0,25,50,75],
  5:[0,6,12,18,24,30,36,42,48,54,60,66,72,78,84,90],
  6:[0]
  },
  36: {
    1:[0],
    2:[0,50],
    3:[0,25,50,75],
    4:[0,17,33,50,67,83],
    5:[0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95],
    6:[0]
  }
};

let parent = {};

//必要ツム数の関数化
function list(maxType) {
  if (parent[maxType]) return parent[maxType];

  let table = {};

  for (let lv = 1; lv <= 6; lv++) {
    if (lv === 6) {
      table[lv] = [0];
      continue;
    }

    let level = hituyou[36][lv];
    let hitu = hituyou[maxType][lv];

    table[lv] = ritu[maxType][lv]
      .map(p => Math.round(p * (hitu / level)))
      .filter((v, i, a) => i === 0 || v !== a[i - 1])
      .map(v => Math.min(v, 100));
  }

  parent[maxType] = table;
  return table;
}

//必要コイン計算
function hitukoin(maxType, skillLv, percent) {
  let botai = 1;

  for (let i = 1; i < skillLv; i++) {
    botai += hituyou[maxType][i];
  }

  let tbl = list(maxType);

    botai += Math.floor(
    tbl[skillLv].length * (percent / 100)
);

  return Math.max(besucoin - botai * levikoin, 0);
}

//合計更新
function update() {
  let total = 0;
  document.querySelectorAll(".coin").forEach(c => {
    total += Number(c.dataset.value || 0);
  });

  document.getElementById("totalCoin").textContent =
    `合計必要コイン：${total.toLocaleString()}`;
}

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("#charList li").forEach(li => {

    let name = li.dataset.name;
    let max = Number(li.dataset.max) || 36;//デフォルト

    let skill = document.createElement("select");
    for (let i = 1; i <= 6; i++) {
      skill.innerHTML += `<option value="${i}">SL${i}</option>`;
    }

    let percent = document.createElement("select");
    let check = document.createElement("input");
    check.type = "checkbox";

    //必要コイン計算
    let coin = document.createElement("span");
    coin.className = "coin";
    coin.dataset.value = 0;

    //％の時の切り替え
    function updatePercent() {
      percent.innerHTML = "";
      list(max)[skill.value].forEach(p => {
        percent.innerHTML += `<option value="${p}">${p}%</option>`;
      });
    }

    //キャラコイン計算
    function kyaracoin() {
      let need = check.checked
        ? 0
        : hitukoin(max, Number(skill.value), Number(percent.value));

      coin.textContent = `必要コイン：${need.toLocaleString()}`;
      coin.dataset.value = need;

      update();
    }

    skill.addEventListener("change", () => {
      check.checked = false;
      updatePercent();
      kyaracoin();
    });

    percent.addEventListener("change", () => {
      check.checked = false;
      kyaracoin();
    });

    check.addEventListener("change", kyaracoin);

    updatePercent();
    kyaracoin();

    li.textContent = `${li.dataset.id}：${name}［${max}体］ `;
    li.append(skill, " ", percent, " ", check, " 完売 ", coin);
  });

  update();
});