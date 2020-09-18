const noteContent = document.querySelector("#content-section");

var calculateContentHeight = function (ta, scanAmount) {
  var origHeight = ta.style.height,
    height = ta.offsetHeight,
    scrollHeight = ta.scrollHeight,
    overflow = ta.style.overflow;
  /// only bother if the ta is bigger than content
  if (height >= scrollHeight) {
    /// check that our browser supports changing dimension
    /// calculations mid-way through a function call...
    ta.style.height = height + scanAmount + "px";
    /// because the scrollbar can cause calculation problems
    ta.style.overflow = "hidden";
    /// by checking that scrollHeight has updated
    if (scrollHeight < ta.scrollHeight) {
      /// now try and scan the ta's height downwards
      /// until scrollHeight becomes larger than height
      while (ta.offsetHeight >= ta.scrollHeight) {
        ta.style.height = (height -= scanAmount) + "px";
      }
      /// be more specific to get the exact height
      while (ta.offsetHeight < ta.scrollHeight) {
        ta.style.height = height++ + "px";
      }
      /// reset the ta back to it's original height
      ta.style.height = origHeight;
      /// put the overflow back
      ta.style.overflow = overflow;
      return height;
    }
  } else {
    return scrollHeight;
  }
};

var calculateHeight = function (textarea) {
  var style = window.getComputedStyle
      ? window.getComputedStyle(textarea)
      : textarea.currentStyle,
    // This will get the line-height only if it is set in the css,
    // otherwise it's "normal"
    taLineHeight = parseInt(style.lineHeight, 10),
    // Get the scroll height of the textarea
    taHeight = calculateContentHeight(textarea, taLineHeight),
    // calculate the number of lines
    numberOfLines = Math.ceil(taHeight / taLineHeight);

  $(textarea).attr("rows", numberOfLines - 1);
};

function ChangeRow() {
  $("textarea").each(function (index, value) {
    calculateHeight(this);
  });
}

function EditNote(e) {
  //e.preventDefault();
  $(e).hide();
  var parentButtons = e.parentElement;
  var noteId = $(parentButtons).attr("data-noteId");
  var noteTextarea = document.querySelector("#" + noteId);

  $(noteTextarea).removeAttr("disabled");
  $(noteTextarea).focus();

  $(noteTextarea).focusout(function () {
    $(noteTextarea).attr("disabled", true);
    $(e).show();
    //save
  });
}

function uniqIdGenerator() {
  return "note-" + Math.round(new Date().getTime() + Math.random() * 100);
}

function AddNote() {
  var noteCardDiv = document.createElement("div");
  var date = new Date().toLocaleString();
  var noteId = uniqIdGenerator();
  noteCardDiv.className = "note-card";
  noteCardDiv.innerHTML = `
  <div class="note-card-header">
  <span id="note-date">${date}</span>
  <div class="buttons" data-noteId="${noteId}">
      <a onclick="EditNote(this)"><i class="fas fa-edit" style="color:yellow;"></i></a>
      <a onclick="DeleteNote(this)"><i class="fas fa-trash-alt" style="color:red;"></i></a>
  </div>
</div>
<div class="note-card-content">
  <textarea id="${noteId}" rows="1" class="note-textarea" disabled>
  </textarea>
</div>
`;
  noteContent.appendChild(noteCardDiv);
}

function DeleteNote(e) {
  var respond = confirm("Are you sure ?");
  if(respond == true){
    var cardDiv = $(e).parent().parent().parent();
    $(cardDiv).remove();
  }
}

$(document).ready(function () {
  ChangeRow();
});
