        // Topic search filter
        function filterTopics() {
            const query = document.getElementById('topicSearch').value.toLowerCase().trim();
            const tags = document.querySelectorAll('.topic-tag');
            const noResults = document.getElementById('noResults');
            let visibleCount = 0;

            tags.forEach(tag => {
                const text = tag.textContent.toLowerCase();
                if (query === '' || text.includes(query)) {
                    tag.classList.remove('hidden');
                    visibleCount++;
                } else {
                    tag.classList.add('hidden');
                }
            });

            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Accordion toggle
        function toggleAccordion(btn) {
            const item = btn.parentElement;
            const body = item.querySelector('.accordion-body');
            const icon = btn.querySelector('.acc-icon');
            const isOpen = item.classList.contains('open');

            if (isOpen) {
                body.style.maxHeight = null;
                item.classList.remove('open');
                icon.textContent = '+';
            } else {
                document.querySelectorAll('#guidelinesAccordion .accordion-item.open').forEach(other => {
                    other.classList.remove('open');
                    other.querySelector('.accordion-body').style.maxHeight = null;
                    other.querySelector('.acc-icon').textContent = '+';
                });
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
                icon.textContent = '−';
            }
        }

        window.addEventListener('resize', () => {
            document.querySelectorAll('#guidelinesAccordion .accordion-item.open').forEach(item => {
                const body = item.querySelector('.accordion-body');
                body.style.maxHeight = body.scrollHeight + 'px';
            });
        });
