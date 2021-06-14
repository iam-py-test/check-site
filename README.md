# check-site
Get a report from common antivirus providers and blocklists

Note: You may experence problems with opening links in another window via the context menu when using uBlock Origin for popup blocking until [#1616](https://github.com/uBlockOrigin/uBlock-issues/issues/1616) is resolved. 

#### What is Check Site?
Check site is an installable browser extention which gives you are report on the current site using URLHaus, Dandilion Sprout's Antimalware, and Check Site's internal blocklists. It also adds an option to check links via the Context Menu. In the report, there are links to more information from Norton, McAfee, Yandex, and Google.

#### Does Check Site block malware sites?
No. Check site _only_ shows information about sites; it does not block them. <br/>
If you want to block malware websites, you can install the browser extentions from the antimalware providers used in Check Site. You also can active your browser's built-in malware and phishing protection and/or install [uBlock Origin](https://github.com/gorhill/uBlock) (recommended) or AdGuard (untested) and install/activate [URLHaus](https://gitlab.com/curben/urlhaus-filter#urlhaus-malicious-url-blocklist) and [Dandlion Sprout's Antimalware](https://github.com/DandelionSprout/adfilt/blob/master/Dandelion%20Sprout's%20Anti-Malware%20List.txt).

#### What is _unrated_ vs _safe_?
If Check Site's internal ratings says _unrated_, this means it does not know if the site is safe or not. If it says _safe_, this means the site has been reviewed and is safe. <br/>
Note that _very few_ sites are rated safe because I have to manually review the site, and that takes time.

#### Installing Check Site
To install Check site, you will need to download it off of GitHub. For more information, see [installing](https://github.com/iam-py-test/check-site/wiki/Installing).<br/>
If someone knows how to upload it to the Chrome Web Store or addons.mozilla.org, please let me know.
