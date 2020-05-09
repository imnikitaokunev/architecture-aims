var content = {
    slides: [],
};

$(document).on("click", ".architecture-aims__slider button", function () {
    onSliderButtonClick($(this));
});
$(document).on("click", ".architecture-aims-page__item button", function () {
    onPageNumberClick($(this));
});

$(document).ready(onLoad);

function onSliderButtonClick(element) {
    let selected = parseInt($(".architecture-aims-slider__number").text());
    let action = element.attr("data-action");

    switch (action) {
        case "prev":
            index = selected <= 1 ? content.slides.length : selected - 1;
            break;
        case "next":
            index = selected >= content.slides.length ? 1 : selected + 1;
            break;
    }

    selectSlide(index);
}

function onPageNumberClick(page) {
    if (page.parent().hasClass("selected")) {
        return;
    }

    let index = parseInt(page.attr("data-page"));
    selectSlide(index);
}

function selectSlide(index) {
    let element = content.slides[index - 1];

    $(".architecture-aims-quote__title").text(element.text); //.slideToggle(300).slideToggle(300);
    $(".architecture-aims-quote__author").text(element.author); //.slideToggle(300).slideToggle(300);

    restartAnimation($(".architecture-aims-quote__title"));
    restartAnimation($(".architecture-aims-quote__author"));

    $(".architecture-aims-page__item.selected").removeClass("selected");
    let page = $('button[data-page="' + index + '"]');
    page.parent().addClass("selected");

    index = index < 10 ? "0" + index : index;
    $(".architecture-aims-slider__number").text(index);
}

function restartAnimation(element) {
    newone = element.clone(true);
    element.before(newone);
    element.remove();
}

// Used free quotes api, see http://paperquotes.com/
class ContentService {
    async getComments() {
        let result = [];
        await $.ajax({
            url: "https://api.paperquotes.com/apiv1/quotes/?tags=love,motivation",
            type: "GET",
        }).done((data) => (result = data));

        return result;
    }
}

function onLoad() {
    let service = new ContentService();
    let data = service
        .getComments()
        .then((x) => setContent(x.results))
        .then(() => selectSlide(1));
}

function setContent(data) {
    let array = data.slice(0, 4).map(function (el) {
        return { text: el.quote, author: el.author };
    });
    content.slides = array;
}
