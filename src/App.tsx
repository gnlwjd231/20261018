import BlurText from './components/BlurText'

function App() {
  return (
    <main className="type-preview">
      <section className="type-card" data-theme="light" aria-label="Light typography preview">
        <p className="type-caption">Chapter 01</p>
        <BlurText text="The Beginning" className="type-title" delay={90} />
        <p className="type-body">
          9년 동안 서로의 일상을 채워온 두 사람이,
          <br />
          이제 하나의 일상을 시작합니다.
        </p>
        <p className="type-caption">Photo 01 / the first frame</p>
      </section>

      <section className="type-card" data-theme="dark" aria-label="Dark typography preview">
        <p className="type-caption">Chapter 02</p>
        <BlurText text="BOOT SEQUENCE" className="type-title" delay={45} animateBy="letters" />
        <p className="type-body">
          &gt; loading memory of us...
          <br />
          &gt; switching to retro mode
        </p>
        <pre className="type-ascii" aria-label="ASCII art preview">
{`+----------------------+
|      *     *        |
|       \\   /         |
|        \\ /          |
|         V           |
+----------------------+`}
        </pre>
        <p className="type-caption">ASCII / 02</p>
      </section>
    </main>
  )
}

export default App;
