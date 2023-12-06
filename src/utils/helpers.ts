export const setCover = (trackUrl, ref) => {
  console.log('setCover')
  var jsmediatags = window.jsmediatags;
  console.log('jsmediatags', jsmediatags)
  console.log('trackUrl', trackUrl)
  new jsmediatags.Reader(trackUrl).setTagsToRead(["picture"]).read({
    onSuccess: function (tag) {
      console.log('onSuccess: ', tag)
      var tags = tag.tags;
      var image = tags.picture;

      var base64String = "";
      for (var i = 0; i < image.data.length; i++) {
          base64String += String.fromCharCode(image.data[i]);
      }
      var base64 = "data:image/jpeg;base64," +
              window.btoa(base64String);

      ref.current.src = base64
    },
    onError: function (error) {
      console.log('err: ', error)
    },
  })
  console.log('after')
}

export function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}