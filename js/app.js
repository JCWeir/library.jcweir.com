$(".js-add-details-item").click(function() {

  var detailsItemInput = $(".add-form-details-container > li:first")
  .clone();

  $("input", detailsItemInput).val("");

  $(".add-form-details-container")
    .append(detailsItemInput);
});

$("#add-new-book").submit(function(e) {
  e.preventDefault();

  var formData = $(this).serializeArray();

  var book = {
    details: []
  };

  $(formData).each(function(index, item) {

    if (item.name === "details[][title]") {

      // Next item is always the value
      var detailsValue = formData[index + 1];

      book.details.push({
        label: item.value,
        value: detailsValue.value,
      });

    } else if (item.name !== "details[][value]") {
      book[item.name] = item.value;
    }
  });

  window.books.push(book);

  // Clear add book form
  $("#add-new-book input, #add-new-book textarea")
    .val("");

  var detailsItemInput = $(".add-form-details-container > li:first")
  .clone();

  $(".add-form-details-container")
    .empty()
    .append(detailsItemInput);

  // Update the collection view
  renderCollectionView();
});


function renderCollectionViewItem(bookId, item) {
  return $("<div>")
    .attr("id", "book-" + bookId)
    .addClass("col-lg-3 col-md-4 col-sm-6 col-xs-12 book")
    .append($("<a>")
      .addClass("book-item-container")
      .append($("<img>")
        .addClass("portfolio-item")
        .attr("src", item.image)
        .attr("alt", "Book Cover Image")
      )
      .append($("<h4>").text(item.title))
    )
    .click(function() {
      renderDetailViewItem(bookId, item);
    });
}

function renderDetailViewItem(bookId, item) {

  // Scroll to the top of the page
  $("body").scrollTop(0);

  $(".book").removeClass("active");

  $("#book-" + bookId).addClass("active");

  // Render details title section
  var detailsTitle = $("<div>")
    .addClass("row")
    .append($("<div>")
      .addClass("col-lg-12")
      .append($("<h1>")
        .addClass("page-header")
        .text(item.title)
        .append($("<small>").text(item.author))
      ));

  // Render details image section
  var detailsImage = $("<div>")
    .addClass("col-md-4")
    .append($("<img>")
      .addClass("img-responsive cover-image")
      .attr("src", item.image)
      .attr("alt", item.title + " cover"));

  var detailsList = $("<ul>");

  $(item.details).each(function(index, item) {
    detailsList.append($("<li>")
      .addClass("detail-list-item")
      .append($("<strong>").text(item.label + ":"))
      .append($("<span>").text(item.value)));
  });

  var detailsDescription = $("<div>")
    .addClass("col-md-8")
    .append($("<h3>").text("Description"))
    .append($("<p>").text(item.description))
    .append($("<h3>").text("Details"))
    .append(detailsList);

  $("#book-detail-container")
    .empty()
    .append(detailsTitle)
    .append($("<div>")
      .addClass("row")
      .append(detailsImage)
      .append(detailsDescription));
}

function renderCollectionView() {
  $("#related-books-container").empty();

  $.each(window.books, function(key, item) {
    $("#related-books-container")
      .append(renderCollectionViewItem(key, item));
  });
}

renderCollectionView();

// Show first book in the list
renderDetailViewItem(0, books[0]);
