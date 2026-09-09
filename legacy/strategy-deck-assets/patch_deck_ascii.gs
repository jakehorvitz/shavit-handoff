/** Post-generation patch: fix arrows, separators, and LinkedIn-accurate facts. */
function patchDeck(){
  var p=SlidesApp.openById('1as6Y-UJAjSzsNkVbq8N8BDw2kKEHYFeoZKxXLyk7IQQ');
  p.replaceAllText('->', '\u2192');            // clean arrow glyph (fixes funnel wrap)
  p.replaceAllText(' | ', ' \u00B7 ');         // pipe -> middot separators
  p.replaceAllText('2,630', '2,631');          // accurate follower count
  p.replaceAllText('Former VP at AM Equipment',
                   'Director of Sales & Marketing at AM Equipment'); // accurate title
  Logger.log('patched: ' + p.getUrl());
  return 'ok';
}
