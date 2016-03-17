<art-list>
  <h2>List of Arts</h2>
  <ul>
    <li each={arts}>
      <a href={this.path}>
        { this.title }
      </a>
    </li>
  </ul>

  this.mixin(GLOBAL.data)
  this.arts = this.site.filter( function (page) { return page.type === 'art' } )
</art-list>

