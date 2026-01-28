let STORAGE_KEY = "koingakegi";//ローカルストレージキー

window.addEventListener("load", () => {
  list();
  total();
})

function botam() {
  let kyaraname = document.getElementById("name");
  let kakukoin = document.getElementById("koin");

  //名前とコインを取得
  let name = kyaraname.value;
  let koin = kakukoin.value;

  //空だったら中止
  if (name === "" || koin === "") return;

  let records = yomi();

  // 日時を保存
  let now = new Date();

  //追加
  records.push({
    name: name,
    koin: Number(koin),
    date: now.toISOString()
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

  hyoji();
  total();

  kyaraname.value = "";
  kakukoin.value = "";
}

//読み込み
function yomi() {
  let data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

//表示
function hyoji() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let records = yomi();

  records.forEach((record, index) => {
    let li = document.createElement("li");
    let date = new Date(record.date);
    let hi =
      `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    li.textContent = `${record.name}：${record.koin}コイン（${hi}）`;

    // 削除
    let sakujo = document.createElement("button");
    sakujo.textContent = "削除";
    sakujo.style.marginLeft = "10px";
    sakujo.onclick = () => selectsakujo(index);

    li.appendChild(sakujo);
    list.appendChild(li);
  });
}

function selectsakujo(index) {
  let records = yomi();
  records.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  hyoji();
  total();
}

function total() {
  let total = document.getElementById("dailyTotal");
  total.innerHTML = "";//初期化

  let records = yomi();
  let dailyMap = {};

  // 日付ごとに合計
  records.forEach(record => {
    let date = new Date(record.date);
    let hi =`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    if (!dailyMap[hi]) {
      dailyMap[hi] = 0;
    }
    dailyMap[hi] += record.koin;
  });

  Object.keys(dailyMap).forEach(date => {
    let li = document.createElement("li");
    li.textContent = `${date}：${dailyMap[date]} コイン`;
    total.appendChild(li);
  });
}