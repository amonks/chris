<art-media>
  <ul>
    <li each={ opts.media }>
      <img src={this.src} if={this.type === 'image'} />
      <vimeo-embed vimeo_id={this.vimeo_id} if={this.type === 'vimeo'} />
    </li>
  </ul>
</art-media>

