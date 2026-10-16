const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const timeElement = document.getElementById("time");
const dayElement = document.getElementById("day");
const dateElement = document.getElementById("date");
const hairclipElement = document.querySelector(".hairclip");
function updateTime() {
  const _v1 = new Date();
  const _v2 = {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  };
  if (timeElement) {
    timeElement.textContent = new Intl.DateTimeFormat("en-GB", _v2).format(_v1);
  }
  const _v3 = new Date(_v1.toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh"
  }));
  if (dayElement) {
    dayElement.textContent = days[_v3.getDay()];
  }
  if (dateElement) {
    dateElement.textContent = _v3.getDate() + ", " + months[_v3.getMonth()];
  }
  if (hairclipElement) {
    const _v4 = (_v3.getMonth() + 1).toString().padStart(2, "0") + "-" + _v3.getDate().toString().padStart(2, "0");
    hairclipElement.style.display = _v4 === "10-31" ? "block" : "none";
  }
}
setInterval(updateTime, 1000);
updateTime();
