import {
    clearStore,
    test,
    assert,
    describe,
    beforeEach,
    log,
  } from "matchstick-as/assembly/index";
  import { encode, decode } from "as-base64";
  import { BigInt, Bytes, json } from "@graphprotocol/graph-ts";
import { getBase64 } from "../src/utils";

const base64 =
  "data:application/json;base64,eyJuYW1lIjogIkJhZyAjODM4IiwgImRlc2NyaXB0aW9uIjogIkxvb3QgaXMgcmFuZG9taXplZCBhZHZlbnR1cmVyIGdlYXIgZ2VuZXJhdGVkIGFuZCBzdG9yZWQgb24gY2hhaW4uIFN0YXRzLCBpbWFnZXMsIGFuZCBvdGhlciBmdW5jdGlvbmFsaXR5IGFyZSBpbnRlbnRpb25hbGx5IG9taXR0ZWQgZm9yIG90aGVycyB0byBpbnRlcnByZXQuIEZlZWwgZnJlZSB0byB1c2UgTG9vdCBpbiBhbnkgd2F5IHlvdSB3YW50LiIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0OGMzUjViR1UrTG1KaGMyVWdleUJtYVd4c09pQjNhR2wwWlRzZ1ptOXVkQzFtWVcxcGJIazZJSE5sY21sbU95Qm1iMjUwTFhOcGVtVTZJREUwY0hnN0lIMDhMM04wZVd4bFBqeHlaV04wSUhkcFpIUm9QU0l4TURBbElpQm9aV2xuYUhROUlqRXdNQ1VpSUdacGJHdzlJbUpzWVdOcklpQXZQangwWlhoMElIZzlJakV3SWlCNVBTSXlNQ0lnWTJ4aGMzTTlJbUpoYzJVaVBrZHlhVzF2YVhKbFBDOTBaWGgwUGp4MFpYaDBJSGc5SWpFd0lpQjVQU0kwTUNJZ1kyeGhjM005SW1KaGMyVWlQa3hsWVhSb1pYSWdRWEp0YjNJOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJall3SWlCamJHRnpjejBpWW1GelpTSStSR2wyYVc1bElFaHZiMlFnYjJZZ1ZHbDBZVzV6UEM5MFpYaDBQangwWlhoMElIZzlJakV3SWlCNVBTSTRNQ0lnWTJ4aGMzTTlJbUpoYzJVaVBrOXlibUYwWlNCQ1pXeDBJRzltSUhSb1pTQkdiM2c4TDNSbGVIUStQSFJsZUhRZ2VEMGlNVEFpSUhrOUlqRXdNQ0lnWTJ4aGMzTTlJbUpoYzJVaVBrUnlZV2R2Ym5OcmFXNGdRbTl2ZEhNOEwzUmxlSFErUEhSbGVIUWdlRDBpTVRBaUlIazlJakV5TUNJZ1kyeGhjM005SW1KaGMyVWlQa3hsWVhSb1pYSWdSMnh2ZG1WelBDOTBaWGgwUGp4MFpYaDBJSGc5SWpFd0lpQjVQU0l4TkRBaUlHTnNZWE56UFNKaVlYTmxJajVPWldOcmJHRmpaU0J2WmlCQmJtZGxjand2ZEdWNGRENDhkR1Y0ZENCNFBTSXhNQ0lnZVQwaU1UWXdJaUJqYkdGemN6MGlZbUZ6WlNJK1IyOXNaQ0JTYVc1blBDOTBaWGgwUGp3dmMzWm5QZz09In0=";



  describe("JSON PARSING", () => {
    test("BASE64", () => {
        //@ts-ignore
        let jsonResult = json.fromBytes(changetype<Bytes>(decode(getBase64(base64))));
        if (jsonResult) {
                 //@ts-ignore
            let name = jsonResult.toObject().get("name")
            if(name) {
              log.info("Name - {}", [name.toString()])
            }
        }
    
       
    })
  })