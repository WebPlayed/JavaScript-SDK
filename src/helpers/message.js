/**
 * Created by franklinwaller on 06/04/15.
 */

var wbpSource = null;

function receiveMessage(event)
{
    wbpSource = event.source;
    scope.isAlive = true;
    scope.onAliveCallback();
}