document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        inputs: {
            sitemapUrl: document.getElementById('sitemapUrl'),
            crawlDelay: document.getElementById('crawlDelay')
        },
        containers: {
            userAgentRules: document.getElementById('userAgentRules'),
            generatedCode: document.getElementById('generatedCode')
        },
        buttons: {
            addUserAgent: document.getElementById('addUserAgentBtn'),
            generate: document.getElementById('generateBtn'),
            copy: document.getElementById('copyBtn'),
            download: document.getElementById('downloadBtn')
        }
    };

    // Presets
    const presets = {
        wordpress: {
            userAgents: [
                {
                    name: '*',
                    disallow: [
                        '/wp-admin/',
                        '/wp-includes/',
                        '/wp-content/plugins/',
                        '/wp-content/themes/',
                        '/wp-login.php',
                        '/wp-*.php',
                        '/xmlrpc.php',
                        '*/trackback/',
                        '*/feed/',
                        '*/comments/'
                    ],
                    allow: [
                        '/wp-admin/admin-ajax.php'
                    ]
                }
            ],
            sitemap: '/sitemap.xml'
        },
        ecommerce: {
            userAgents: [
                {
                    name: '*',
                    disallow: [
                        '/cart/',
                        '/checkout/',
                        '/my-account/',
                        '/wishlist/',
                        '/order/',
                        '/search/',
                        '/*?s=*',
                        '/*?filter=*',
                        '/*?sort=*',
                        '/tag/',
                        '/author/'
                    ],
                    allow: [
                        '/products/',
                        '/categories/'
                    ]
                }
            ],
            sitemap: '/sitemap.xml'
        },
        blog: {
            userAgents: [
                {
                    name: '*',
                    disallow: [
                        '/private/',
                        '/drafts/',
                        '/admin/',
                        '/login/',
                        '/signup/',
                        '/search/',
                        '/*?s=*',
                        '/author/',
                        '/tag/',
                        '/category/*/page/*'
                    ],
                    allow: [
                        '/posts/',
                        '/articles/'
                    ]
                }
            ],
            sitemap: '/sitemap.xml'
        },
        media: {
            userAgents: [
                {
                    name: '*',
                    disallow: [
                        '/members/',
                        '/premium/',
                        '/download/',
                        '/admin/',
                        '/login/',
                        '/search/',
                        '/*?q=*',
                        '/author/',
                        '/tag/',
                        '/playlist/'
                    ],
                    allow: [
                        '/videos/',
                        '/images/',
                        '/gallery/'
                    ]
                }
            ],
            sitemap: '/sitemap.xml'
        }
    };

    let userAgentRules = [];

    // Initialize
    initializeEventListeners();
    addUserAgentRule(); // Add first rule by default

    function initializeEventListeners() {
        elements.buttons.addUserAgent.addEventListener('click', addUserAgentRule);
        elements.buttons.generate.addEventListener('click', generateRobotsTxt);
        elements.buttons.copy.addEventListener('click', copyToClipboard);
        elements.buttons.download.addEventListener('click', downloadRobotsTxt);
    }
}); 