<ul class="lr-results__list">
    {{#hits}}
    <li class="lr-result" data-doc-id="{{_id}}">
        <a href="{{_source.url}}" target="_blank">
            <img class="lr-result__thumb" alt="Resource thumbnail" title="{{ _source.title }}" style="width: 145px;"
                data-original="{{global.domain}}/webcap/{{_id}}/145/screencap.jpg"
                src="{{ default_res_image }}"
            />
        </a>
        <h3 class="lr-result__heading">
            <a href="{{ _source.url }}" target="_blank">{{ _source.title }}</a>
        </h3>
        <div class="lr-result__source">
            Source: <a href="http://{{_source.url_domain}}" target="_blank">{{_source.url_domain}}</a>
        </div>
        <div class="lr-result__description">
            {{#highlight.description}}
                {{{ highlight.description }}}
            {{/highlight.description}}

            {{^highlight.description}}
                {{{ truncatedDescription }}}
            {{/highlight.description}}
        </div>
        <div class="lr-result__url">
            <a title="Go to {{ _source.url }}" href="{{ _source.url }}" target="_blank">{{ _source.url }}</a>
        </div>
    </li>
    {{/hits}}
</ul>

{{#hasNext}}
    <div class="lr-results__next"><a href="#">Show More Results &raquo;</a></div>
{{/hasNext}}
