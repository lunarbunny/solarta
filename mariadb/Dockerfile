FROM mariadb:11.1.2-jammy

RUN useradd -m -g mysql maria && \
    chown -R maria:mysql /var/lib/mysql

USER maria
