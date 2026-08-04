/*
  Paste a Google Apps Script web-app URL below after following SETUP.md.
  Leaving it blank keeps the beautiful confirmation flow for previewing only.
*/
const RSVP_ENDPOINT = "";
let currentLanguage = "en";
const translations = {
  zh: {
    navRsvp:"回覆",heroEyebrow:"携手开启新的旅程",heroDate:"2026年9月19日，星期六",heroVenue:"金阳迎宾楼 · Golden Sun Restaurant · Kuchai Lama · 晚宴 7:00 PM 开始",heroCta:"与我们一同庆祝",
    introEyebrow:"让我们的下一段旋律，从这里开始",introTitle:"这一晚，因为有你而更加温暖。",introCopy:"我们要结婚了——在这段旅程里，有你们一路的支持与陪伴，这一天才更显完整。",
    detailsEyebrow:"给你的一封小邀请",detailsTitle:"请记下这个日子",whenLabel:"日期",whenCopy:"星期六<br /><strong>2026年9月19日</strong>",scheduleLabel:"当天安排",scheduleCopy:"<strong>5:00 PM</strong> · 敬茶仪式<br /><strong>7:00 PM</strong> · 婚宴庆祝",whereLabel:"地点",whereCopy:"<strong>金阳迎宾楼</strong><br /><span class=\"chinese-name\">Golden Sun Restaurant</span><br />Kuchai Lama",teaNote:"<span>家人及亲戚</span> 敬请于 <strong>5:00 PM</strong> 前抵达，参与敬茶仪式。",
    posterEyebrow:"我们的 Save the Date",posterTitle:"值得好好庆祝的旅程。",posterCopy:"从北海道的雪景回忆，到古仔路的这一晚，很开心在我们人生的下一章里有你们同行。",posterNote:"♫ 带上好心情，一起来庆祝吧。",galleryEyebrow:"一些我们珍藏的瞬间",galleryTitle:"我们的故事，慢慢看。",
    rsvpDeadline:"请于 2026年8月31日 前回复",rsvpTitle:"你会来吗？",rsvpLead:"我们很期待在这幸福的一天和你相聚。",attendanceLabel:"是否出席",accepts:"欣然出席",declines:"抱歉无法出席",nameLabel:"您的姓名",namePlaceholder:"请填写全名",guestLabel:"同行宾客姓名",guestPlaceholder:"如有同行宾客，请填写姓名",paxLabel:"出席人数",paxPlaceholder:"请选择人数",allergyLabel:"食物过敏或饮食需求",allergyPlaceholder:"如没有，请填写“无”。",submit:"提交回覆",backTop:"回到顶部 ↑",thanksEyebrow:"谢谢你",thanksTitle:"我们已收到你的回覆。",thanksCopy:"很开心收到你的消息，期待当天与您相见。",sending:"提交中…",error:"出了点问题，请稍后再试。"
  },
  en: {}
};
function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  const dictionary = translations[language] || {};
  document.querySelectorAll("[data-i18n]").forEach((element) => { const key = element.dataset.i18n; if (language === "en") element.textContent = element.dataset.en || element.textContent; else if (dictionary[key]) { if (!element.dataset.en) element.dataset.en = element.textContent; element.textContent = dictionary[key]; } });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => { const key = element.dataset.i18nHtml; if (language === "en") element.innerHTML = element.dataset.en || element.innerHTML; else if (dictionary[key]) { if (!element.dataset.en) element.dataset.en = element.innerHTML; element.innerHTML = dictionary[key]; } });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => { const key = element.dataset.i18nPlaceholder; if (!element.dataset.en) element.dataset.en = element.placeholder; element.placeholder = language === "en" ? element.dataset.en : dictionary[key]; });
  document.querySelector("#language-toggle").textContent = language === "en" ? "中" : "EN";
}
document.querySelector("#language-toggle").addEventListener("click", () => setLanguage(currentLanguage === "en" ? "zh" : "en"));

const form = document.querySelector("#rsvp-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = currentLanguage === "zh" ? translations.zh.sending : "Sending…";
  try {
    if (RSVP_ENDPOINT) {
      await fetch(RSVP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() })
      });
    }
    const copy = currentLanguage === "zh" ? translations.zh : { thanksEyebrow:"Thank you", thanksTitle:"We’ve received your RSVP.", thanksCopy:"We’re so happy to hear from you and can’t wait to celebrate together." };
    form.innerHTML = `<div class="thanks"><p class="eyebrow plum">${copy.thanksEyebrow}</p><h3>${copy.thanksTitle}</h3><p>${copy.thanksCopy}</p></div>`;
    status.textContent = "";
  } catch (error) {
    status.textContent = currentLanguage === "zh" ? translations.zh.error : "Something went wrong. Please try again in a moment.";
    button.disabled = false;
    button.textContent = currentLanguage === "zh" ? translations.zh.submit : "Send RSVP";
  }
});
