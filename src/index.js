const LOCAL_CACHE_KEY = "list-data";

// 初始化
function init() {
  refreshList();
}

// 刷新列表
function refreshList() {
  const list = getList();
  // 清空当前 ul 下的元素
  const listContainer = document.getElementById("list-container");
  // 创建碎片节点
  const fragmentEle = document.createDocumentFragment();
  // 将 list 中的节点放入 fragment
  list.forEach((item) => {
    const { id, name, count } = item;
    const li = document.createElement("li");
    li.className = "item";
    // 添加编辑的点击事件
    li.onclick = () => editItem(id, name, count);

    // 创建名称节点
    const nameEle = document.createElement("span");
    nameEle.textContent = name;
    nameEle.className = "item-name";

    // 创建数量节点
    const countEle = document.createElement("span");
    countEle.textContent = count;
    countEle.className = "item-count";

    // li 中添加名称和数量节点
    li.appendChild(nameEle);
    li.appendChild(countEle);

    // fragment 中添加 li
    fragmentEle.appendChild(li);
  });

  // 将 fragment 插入到列表容器中
  listContainer.appendChild(fragmentEle);
}

// 拿到列表数据
function getList() {
  return JSON.parse(localStorage.getItem(LOCAL_CACHE_KEY)) || [];
}

// 设置列表数据
function setList(values) {
  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(values));
}

// 处理编辑项目
function editItem(id, name, count) {
  // 设置当前点击项目的值
  setFieldValues({
    name,
    count,
  });
  showForm();
  const submitBtn = document.getElementById("submit-btn");
  // 添加此时提交按钮的处理函数
  submitBtn.onclick = (e) => {
    e.preventDefault();
    handleEditItem(id);
  };
}

// 添加项目
function addItem() {
  // 设置表单初始值
  setFieldValues({
    name: "",
    count: "",
  });
  showForm();
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.onclick = (e) => {
    e.preventDefault();
    handleAddItem();
  };
}

function handleAddItem() {
  const values = getFieldsValues();
  // 在 name 和 count 都填写完整时才进行添加
  if (values.name && values.count) {
    addItemIntoStorage(values);
    refreshList();
    hideForm();
  } else {
    showErrorMessage("请填写完整");
  }
}

function handleEditItem(id) {
  const values = getFieldsValues();
  // 在 name 和 count 都填写完整时才进行编辑
  if (values.name && values.count) {
    updateItemIntoStorage(id, values);
    refreshList();
    hideForm();
  } else {
    showErrorMessage("请填写完整");
  }
}

function showErrorMessage(msg) {
  const errorEle = document.createElement("span");
  errorEle.textContent = msg;
  errorEle.className = "error-msg";
  document.body.appendChild(errorEle);
  setTimeout(() => {
    document.body.removeChild(errorEle);
  }, 2000);
}

function setFieldValues(values) {
  const inputElements = document.querySelectorAll(`#edit-form input`);
  // 拿到表单的值
  inputElements.forEach((ele) => {
    const { name: field } = ele;
    if (values.hasOwnProperty(field)) {
      ele.value = values[field];
    }
  });
}

function showForm() {
  const editFormEle = document.getElementById("edit-form");
  editFormEle.style.bottom = 0;
}

function hideForm() {
  const editFormEle = document.getElementById("edit-form");
  editFormEle.style.bottom = "-200px";
}

function getFieldsValues() {
  const inputElements = document.querySelectorAll(`#edit-form input`);
  const values = {};
  // 拿到表单的值
  inputElements.forEach((ele) => {
    const { name, value } = ele;
    if (name) {
      values[name] = value;
    }
  });

  return values;
}

// 添加项目到存储
function addItemIntoStorage(value) {
  const list = getList();
  const id = Math.floor(Math.random() * 100000);
  setList([...list, { ...value, id }]);
}

// 更新项目到存储
function updateItemIntoStorage(id, values) {
  const list = getList();
  const finalList = list.map((item) => {
    if (item.id === id) {
      return {
        ...values,
        id,
      };
    }
    return item;
  });
  setList(finalList);
}

init();
