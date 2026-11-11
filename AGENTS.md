<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Administrator provisioning uses authenticated server functions which check the caller's database role before dynamically loading the privileged client; browser code cannot assign roles.
- Articles use Markdown without raw HTML, a shared cover URL and ordered gallery objects; the dedicated dashboard editor writes through existing administrator RLS, and category pages select published articles only.
- Packages store reference tariffs as numeric fields and link bouquets to a parent circuit; shared display and validation helpers keep group quotes distinct from per-person quotes.
